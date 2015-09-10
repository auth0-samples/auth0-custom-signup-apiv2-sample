var apiEndpoint = 'https://' + AUTH0_DOMAIN + '/api/v2/';
var auth0 = new Auth0({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID
});

// Copy signup fields to login fields for convenience
function copy (a, b) {
    $(a).on('keyup blur', function () {
        $(b).val(this.value);
    });
}
copy('#signup-email', '#login-email');
copy('#signup-password', '#login-password');

$('#signup').submit(function (e) {
    e.preventDefault();
    function signupCallback (err, profile, id_token) {
        if (err) {
            alert('Something went wrong signing up: ' + err);
            console.error(err);
        } else {
            var data = {
                user_metadata: {
                    favorite_color: $('#color').val(),
                    name: $('#name').val()
                }
            };

            function updateSuccess () {
                alert('Successfully signed up!');
            }

            function updateError (jqXHR) {
                alert('Something went wrong signing up: ' + jqXHR.responseText);
                console.error(jqXHR);
            }

            v2PatchUser(profile.user_id, id_token, data, updateSuccess, updateError);
        }
    }

    auth0.signup({
        // Don't display a popup to set an SSO cookie
        sso: false,
        auto_login: true,
        connection: AUTH0_DB_CONNECTION_NAME,
        email: $('#signup-email').val(),
        password: $('#signup-password').val()
    }, signupCallback);

});

$('#login').submit(function (e) {
    e.preventDefault();
    auth0.login({
        sso: false,
        connection: AUTH0_DB_CONNECTION_NAME,
        scope: 'openid email user_metadata',
        email: $('#login-email').val(),
        password: $('#login-password').val(),
        callbackURL: 'http://jwt.io',
        callbackOnLocationHash: true
    });
});

// TODO Add this as a method in auth0.js
function v2PatchUser (userId, id_token, data, successCallback, errorCallback) {
    $.ajax({
        method: 'patch',
        url: apiEndpoint + 'users/' + userId,
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + id_token
        },
        data: data,
        success: successCallback,
        error: errorCallback
    });
}

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
    var data = {
        name: $('#name').val(),
        email: $('#signup-email').val(),
        password: $('#signup-password').val(),
        user_metadata: {
            favorite_color: $('#color').val()
        },
        connection: AUTH0_DB_CONNECTION_NAME
    };
    function successCallback () {
        alert('Successfully signed up!');
    }
    function errorCallback (jqXHR) {
        alert('Something went wrong: ' + jqXHR.responseJSON.message);
    }

    v2SignUp(data, successCallback, errorCallback);
});

$('#login').submit(function (e) {
    e.preventDefault();
    function loginCallback (err, profile, idToken) {
        if (err) {
            console.err('Something went wrong when logging in: ' + err);
        } else {
            window.location.href = 'http://jwt.io?value=' + idToken;
        }
    }

    auth0.login({
        email: $('#login-email').val(),
        password: $('#login-password').val(),
        sso: false,
        connection: AUTH0_DB_CONNECTION_NAME,
        scope: 'openid profile'
    }, loginCallback);
});

// TODO Add this as a method in auth0.js
function v2SignUp (data, successCallback, errorCallback) {
    $.ajax({
        method: 'post',
        url: apiEndpoint + 'users',
        headers: {
            'Authorization': 'Bearer ' + AUTH0_APIV2_TOKEN
        },
        data: data,
        dataType: 'json',
        success: successCallback,
        error: errorCallback
    });
}

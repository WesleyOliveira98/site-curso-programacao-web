function initAuthUI() {
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                return true
            },
            signInFailure: function(error) {
                console.log(error)
            },
            uiShown: function() {
                document.getElementById('loader').style.display = 'none';
            }
        },
        signInFlow: 'popup',
        signInSuccessUrl: '/home/',
        signInOptions: [
            { provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID }
        ]
    };

    ui.start('#firebaseui-auth-container', uiConfig);
}

function logOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("deslogado")
      }).catch((error) => {
        // An error happened.
        console.log(error)
      });
}
alert("auth called");

// TODO: Did not test
if ((Oidc && Oidc.Log && Oidc.Log.logger)) {
  Oidc.Log.logger = console;
}
//{ loadUserInfo: true, filterProtocolClaims: true }
new Oidc.UserManager().signinRedirectCallback().then(function (user) {
  alert("auth");
  if (user == null) {
    // document.getElementById("waiting").style.display = "none";
    // document.getElementById("error").innerText = "No sign-in request pending.";
    console.log('No sign-in request pending.')
  } else {
    var url = window.localStorage.getItem('react:url');
    // console.log(user.profile.role);
    if (url == null || url == '/') {
      var UserRoles = user.profile.role;
      if (UserRoles.includes('Dms')) {
        url = '/dms/dashboard';
      } else if (UserRoles.includes('Ivet')) {
        url = '/ivet/dashboard';
      } else {
        url = '/';
      }
    }
    window.location = url;
  }
}).catch(function (er) {
  document.getElementById("waiting").style.display = "none";
  document.getElementById("error").innerText = er.message;
});

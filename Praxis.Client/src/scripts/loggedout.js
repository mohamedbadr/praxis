if ((Oidc && Oidc.Log && Oidc.Log.logger)) {
    Oidc.Log.logger = console;
}
new Oidc.UserManager().signoutRedirectCallback().then(function (resp) {

   // console.log('signed out', resp);
}).catch(function (err) {
    console.log(err);
});

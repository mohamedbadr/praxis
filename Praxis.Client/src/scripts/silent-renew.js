// if ((Oidc && Oidc.Log && Oidc.Log.logger)) {
//   //  Oidc.Log.logger = console;
// }
new Oidc.UserManager().signinSilentCallback().catch((err) => {
    console.log(err);

});

var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var dialogsModule = require("ui/dialogs");
var UserViewModel = require("../../shared/view-models/user-view-model");

var email;
var user = new UserViewModel({
    email: "banelos@gmail.com",
    password: "test"
});

exports.loaded = function(args) {
    var page = args.object;
    page.bindingContext = user;
    email = viewModule.getViewById(page, "email");
};

exports.signIn = function() {
    user.login()
        .catch(function(error) {
            console.log(error);
            dialogsModule.alert({
                message: "Unfortunately we could not find your account.",
                okButtonText: "OK"
            });
            return Promise.reject();
        })
        .then(function() {
            frameModule.topmost().navigate("views/list/list");
        });
};

exports.register = function() {
    var topmost = frameModule.topmost();
    topmost.navigate("views/register/register");
};
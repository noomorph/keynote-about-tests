module.exports = WixPageObject;

function WixPageObject(browser) {
    this.browser = browser;
}

WixPageObject.BASE_URL = "https://wix.com";
WixPageObject.TEMPLATE_URL = "http://editor.wix.com/html/editor/web/renderer/edit/cfbcdd97-27e1-480c-aff0-482c4163bce6";

WixPageObject.prototype.loginAs = function (email, password, done) {
    var browser = this.browser;

    browser.visit(WixPageObject.BASE_URL, function () {
        browser.
            click("#login_menu_button").
            fill("#login-input-email", email).
            fill("#login-input-password", password).
            click("#context-switch-radio-login").
            pressButton("#login-action-go", done);
    });

    return this;
};

WixPageObject.prototype.buildEditorUrl = function (options) {
    var url = WixPageObject.TEMPLATE_URL,
        delim = "?";

    for (var key in options) {
        url += delim + key + "=" + options[key];
        delim = "&";
    }

    return url;
};

WixPageObject.prototype.gotoEditor = function (options, done) {
    var url = this.buildEditorUrl(options);
    this.browser.location = url;
    this.browser.wait(done);

    return this;
};


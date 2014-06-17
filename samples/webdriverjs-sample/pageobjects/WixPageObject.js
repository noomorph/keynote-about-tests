module.exports = WixPageObject;

function WixPageObject(driver) {
    this.driver = driver;
}

WixPageObject.BASE_URL = "https://wix.com";
WixPageObject.TEMPLATE_URL = "http://editor.wix.com/html/editor/web/renderer/edit/cfbcdd97-27e1-480c-aff0-482c4163bce6";

WixPageObject.prototype.loginAs = function (email, password) {
    this.driver.get(WixPageObject.BASE_URL);
    this.driver.findElement({ id: "login_menu_button" }).click();
    this.driver.findElement({ id: "login-input-email" }).sendKeys(email);
    this.driver.findElement({ id: "login-input-password" }).sendKeys(password);
    this.driver.findElement({ id: "context-switch-radio-login" }).click();
    this.driver.findElement({ id: "login-action-go" }).click();

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

WixPageObject.prototype.gotoEditor = function (options) {
    var url = this.buildEditorUrl(options);
    this.driver.get(url);

    return this;
};

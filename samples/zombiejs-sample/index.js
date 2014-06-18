var fs            = require('fs'),
    chai          = require('chai'),
    expect        = chai.expect,
    Browser       = require('zombie'),
    WixPageObject = require("./WixPageObject");
    config        = require('./config'),
    browser       = new Browser();
 
describe('Horizontal line pixel bug', function() {
    var browser = {};
    var page;
 
    this.timeout(3 * 60 * 1000);

    before(function(){
        browser = new Browser();
        page = new WixPageObject(browser);
    });
 
    describe("when logged in", function () {
        before(function(){
            page.loginAs(config.email, config.password);
        });

        describe("when went to editor page", function () {
            before(function () {
                page.gotoEditor(config.editorConfig);
            });

            it("should initialize a screenshot", function () {
                console.log(browser.evaluate("window.location.href"));
            });
        });
    });
});

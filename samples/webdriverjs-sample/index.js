var fs            = require('fs'),
    chai          = require('chai'),
    expect        = chai.expect,
    test          = require('selenium-webdriver/testing'),
    webdriver     = require('selenium-webdriver'),
    Keys          = webdriver.Key,
    WixPageObject = require('./pageobjects/WixPageObject'),
    config        = require('./config');
 
test.describe('Horizontal line pixel bug', function(){
    var driver = {};
    var page;
 
    this.timeout(3 * 60 * 1000);

    test.before(function(){
        driver = new webdriver.Builder().
                withCapabilities(webdriver.Capabilities.firefox()).
                build();

        driver.manage().timeouts().implicitlyWait(30 * 1000);
        page = new WixPageObject(driver);
    });
 
    test.describe("when logged in", function () {
        test.before(function(){
            page.loginAs(config.email, config.password);
        });

        test.describe("when went to editor page", function () {
            test.before(function () {
                page.gotoEditor(config.editorConfig);
            });

            test.it("should make a screenshot", function () {
                driver.takeScreenshot().then(function (image, err) {
                    var date = new Date().toISOString().substring(0, 19);
                    var filename = config.folders.screenshots + '/editor ' + date + '.png';

                    fs.writeFile(filename, image, 'base64', function(err) {
                        if (err) {
                            expect(function () { throw err; }).not.to.throw(Error);
                        }
                    });
                });
            });
        });

        test.after(function () {
            driver.quit();
        });
    });
});

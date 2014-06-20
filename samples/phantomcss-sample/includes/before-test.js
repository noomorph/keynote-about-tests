chai.should();
mocha.setup({ ui: 'bdd', reporter: WebConsole});

mocha.screenshot = function (done, screenshotName) {
    mocha.screenshotDone = function () {
        done();
        delete mocha.screenshotDone;
    };

    console.log("__PHANTOMCSS__ SCREENSHOT " + screenshotName);
};

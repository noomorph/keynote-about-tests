var SCREENSHOT_REGEX = /__PHANTOMCSS__ SCREENSHOT\s+(.*)$/,
    TEST_ENDED_REGEX = /__CASPERJS__ END/,
    BASE_URL = 'http://question.site44.com/app.html?emin';

var phantomcss = require('./PhantomCSS/phantomcss.js');
phantomcss.init({ libraryRoot: './PhantomCSS/' });

casper.on('remote.message', function (message) {
    console.log(message);

    var match = (message || "").trim().match(SCREENSHOT_REGEX),
        screenshotName;

    if (match && match.length > 1) {
        screenshotName = match[1];
        phantomcss.screenshot('html', screenshotName);
        casper.thenEvaluate(function () {
            mocha.screenshotDone();
        });
    }

    if (TEST_ENDED_REGEX.test(message)) {
        phantomcss.compareAll();
    }
});

casper.start(BASE_URL, function () {
    // HACK: to change the page look
    casper.evaluate(function () {
        document.querySelector("h1").style.visibility = "hidden";
    });

    casper.page.injectJs('includes/WebConsole.js');
    casper.page.injectJs('includes/chai.js');
    casper.page.injectJs('includes/mocha.js');
    casper.page.injectJs('includes/before-test.js');
    casper.page.injectJs('specs/walkthrough.js');
    casper.page.injectJs('includes/after-test.js');
});

casper.viewport(1024, 768);

casper.run(function () {
    phantom.exit(phantomcss.getExitStatus());
});

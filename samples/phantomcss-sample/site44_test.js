var phantomcss = require('./PhantomCSS/phantomcss.js'),
    BASE_URL = 'http://question.site44.com/app.html?emin';

phantomcss.init({ libraryRoot: './PhantomCSS/' });
casper.start(BASE_URL, function () {
    // HACK: to change the page look
    casper.evaluate(function () {
        // document.body.setAttribute("style", "margin-left: 1px");
    });
});

casper.viewport(1024, 768);
casper.then(suite_when_visited_page);
casper.then(suite_when_clicked_without_filling_form);
casper.then(suite_when_filled_the_form);
casper.then(suite_when_test_has_started);
casper.thenOpen(BASE_URL + "#/questions/1", suite_when_backwarded_question);
casper.then(suite_when_test_is_passed);
casper.then(compare_screenshots);
casper.run(in_the_end);

function suite_when_visited_page() {
    phantomcss.screenshot('html', 'home - empty fields');
}

function suite_when_clicked_without_filling_form() {
    casper.then(submit_form);
    phantomcss.screenshot('html', 'home - required fields');
}

function suite_when_filled_the_form() {
    this.fillSelectors('form', {
        '#name': 'Long John',
        '#age': '33',
    }, false); // submit

    this.click('[name=gender]');
    this.click('#agree');

    phantomcss.screenshot('html', 'home - valid fields');
}

function suite_when_test_has_started() {
    casper.then(submit_form);
    casper.then(answer_a_question);
    casper.then(answer_a_question);

    phantomcss.screenshot('html', 'question - forward');
}

function suite_when_backwarded_question() {
    casper.then(wait_to_enable_buttons);
    phantomcss.screenshot('html', 'question - on return');
}

function suite_when_test_is_passed() {
    casper.evaluate(function () {
        this.test.questions.forEach(function (q) { q.answer(0); });
        this.test.ended(true);
    });

    phantomcss.screenshot('html', 'results page');
}

function compare_screenshots() {
    phantomcss.compareAll();
}

function submit_form() {
    this.click('[type=submit]');
}

function answer_a_question() {
    wait_to_enable_buttons();
    this.click('.controls button');
    wait_to_enable_buttons();
}

function wait_to_enable_buttons() {
    casper.waitWhileSelector('.controls button[disabled]');
}

function in_the_end() {
    console.log('THE END');
    phantom.exit(phantomcss.getExitStatus());
}

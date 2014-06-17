var links = [];
var casper = require('casper').create();
var page = require('./pageobjects/GooglePageObject');

casper.start('http://google.fr/', function() {
    this.evaluate(page.type_into_search, "form input[name=q]", "casperjs");
}).waitFor(function () {
    return this.evaluate(page.get_links).length > 0;
}, function () {
    links = this.evaluate(page.get_links);
    this.evaluate(page.type_into_search, "form input[name=q]", "phantomjs");
});

casper.then(function() {
    links = links.concat(this.evaluate(page.get_links));
});

casper.run(function() {
    this.echo(links.length + ' links found:');
    this.echo(' - ' + links.join('\n - ')).exit();
});

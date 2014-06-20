(function () {
    console.log('starting Mocha... ');
    var runner = window.mocha.run();
    runner.on("end", function () {
        console.log("__CASPERJS__ END");
    });
    runner.on("fail", function () {
        console.log.apply(console, arguments);
        console.log("__CASPERJS__ END");
    });
}());

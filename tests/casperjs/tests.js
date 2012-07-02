var casper = require('casper').create();
// TODO: Make URL based on command line argument and host own static server.
var URL = 'http://localhost:8000/architecture-examples/angularjs-perf/';

casper.start(URL, function () {
    this.test.assertTitleMatch(/TodoMVC$/);

    this.test.assertEval(function () {
        return document.querySelectorAll("#todo-list li").length === 0;
    }, "TODO list is empty at the start");

    this.test.assertEquals(this.fetchText("#todo-count strong"), "0",
                           "TODO count is 0 at the start");
});

casper.run(function () {
    this.test.renderResults(true);
});

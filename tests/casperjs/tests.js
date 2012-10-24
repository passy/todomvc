var casper = require('casper').create();
// TODO: Launch a local server from the test runner.
var URL = 'http://localhost:8000/architecture-examples/angularjs-perf/';

casper.start(URL, function () {
	this.test.assertTitleMatch(/TodoMVC$/);

	this.test.assertEval(function () {
		return document.querySelectorAll('#todo-list li').length === 0;
	}, 'list is empty at the start');

	this.test.assertEquals(this.fetchText('#todo-count strong'), '0',
						   'list count is 0 at the start');
});

casper.then(function () {
	this.page.sendEvent('keydown', 'Some Task');
	this.page.sendEvent('keydown', this.page.event.key.Enter);

	this.test.assertEval(function () {
		return document.querySelectorAll('#todo-list li').length === 1;
	}, 'list contains one item');

	this.test.assertEquals(this.fetchText('#todo-list li:first-child label'),
						   'Some Task');
});

casper.run(function () {
	this.test.renderResults(true);
});

// vim:noexpandtab:


var casper = require('casper').create();
// var __utils__ = require('clientutils').create();

// TODO: Launch a local server from the test runner.

// KO : http://localhost:8000/architecture-examples/spine/
// OK : http://localhost:8000/architecture-examples/angularjs/
// OK : http://localhost:8000/architecture-examples/angularjs-perf/
// KO : http://localhost:8000/architecture-examples/backbone/
// KO : http://localhost:8000/architecture-examples/emberjs/
// KO : http://localhost:8000/architecture-examples/gwt/
// KO : http://localhost:8000/architecture-examples/jquery/
// OK (after the pullrequest ;) : http://localhost:8000/architecture-examples/dart/web/
var URL = 'http://localhost:8000/architecture-examples/dart/web/';

// TODO remove ?
function removeMultipleSpaces(str) {
	var result = str.replace(/  /g, ' ');
	if(result == str) {
		return result;
	} else {
		return removeMultipleSpaces(result);
	}
}

casper.addTodo = function(title) {
	// TODO about initial focus testing
	this.page.sendEvent('keydown', title);
	// TODO remove one, but keep which event ? Jquery impl prefers keyup...
	this.page.sendEvent('keydown', this.page.event.key.Enter);
	this.page.sendEvent('keyup', this.page.event.key.Enter);
};

//casper.assertLeftItems = function(leftItemsNumber, message) {
//};

casper.start(URL, function () {
	this.test.assertTitleMatch(/TodoMVC$/, 'Page title contains TodoMVC');

	this.test.assertEval(function () {
		return document.querySelectorAll('#todo-list li').length === 0;
	}, 'No todo at start');

	this.test.assertEquals(this.fetchText('#todo-count strong'), '0', 'Left todo list count is 0');

	// TODO test the entire string would make a better test (for plural form) but with Spline fetchText produces some '\n'
	// + it could be "0 item left" instead of "0 items left"
	// this.test.assertEquals(this.fetchText('#todo-count'), '0 items left', 'list count is 0');

	this.test.assertNotVisible('#main', '#main section is hidden');
	this.test.assertNotVisible('#toggle-all', '#toggle-all checkbox is hidden');
	this.test.assertNotVisible('#todo-count', '#todo-count span is hidden');
});

// Create a first todo
casper.then(function () {
	this.addTodo('Some Task');

	this.test.assertEval(function () {
		return document.querySelectorAll('#todo-list li').length === 1;
	}, 'One todo has been added, list contains 1 item');

	// this.test.assertEquals(this.fetchText('#todo-count'), '1 item left', 'list count is 1');
	this.test.assertEquals(this.fetchText('#todo-count strong'), '1', 'Left todo list count is 1');
	this.test.assertEquals(removeMultipleSpaces(this.fetchText('#todo-count').replace(/\n/g, '').trim()), '1 item left', 'Left todo list count is 1');

	this.test.assertEquals(this.fetchText('#todo-list li:first-child label'), 'Some Task', 'First todo is "Some Task"');

	this.test.assertVisible('#main', '#main section is displayed');
	this.test.assertVisible('#toggle-all', '#toggle-all checkbox is displayed');
	this.test.assertVisible('#todo-count', '#todo-count span is displayed');
});

// Create a second todo
casper.then(function () {
	// let's test trim()
	this.addTodo(' Some Another Task ');

	this.test.assertEval(function () {
		return document.querySelectorAll('#todo-list li').length === 2;
	}, 'A second todo has been added, list contains 2 items');

	this.test.assertEquals(this.fetchText('#todo-count strong'), '2', 'Left todo list count is 2');

	this.test.assertEquals(this.fetchText('#todo-list li:nth-child(2) label'), 'Some Another Task', 'Second todo is "Some Another Task"');
});

// Create a third todo and complete second
casper.then(function () {
	this.addTodo('A Third Task');

	this.test.assertEquals(this.fetchText('#todo-count strong'), '3', 'One todo has been added, left todo list count is 3');

	this.test.assertNotVisible('#clear-completed', '#clear-completed button is hidden');

	// __utils__.findOne('').click();
	this.evaluate(function() {
		document.querySelector('#todo-list li:nth-child(2) input[type=checkbox]').click();
	});

	this.test.assertEquals(this.fetchText('#todo-count strong'), '2', 'Todo #2 has been completed, left todo list count is 2');

	this.test.assertVisible('#clear-completed', '#clear-completed button is displayed');

	this.test.assertEval(function () {
		return document.querySelectorAll('#todo-list li').length === 3;
	}, 'List still contains 3 items');
});

// Remove completed todo
casper.then(function () {
	this.evaluate(function() {
		document.querySelector('#clear-completed').click();
	});

	this.test.assertEquals(this.fetchText('#todo-count strong'), '2', 'Todo #2 has been removed, left todo list count is still 2');

	this.test.assertEquals(this.fetchText('#todo-list li:nth-child(2) label'), 'A Third Task', 'Second left todo is previous third one');

	this.test.assertNotVisible('#clear-completed', '#clear-completed button is hidden again');

	this.test.assertEval(function () {
		return document.querySelectorAll('#todo-list li').length === 2;
	}, 'List contains 2 items');
});

// Complete all todos
casper.then(function () {
	this.evaluate(function() {
		document.querySelector('#toggle-all').click();
	});

	this.test.assertEquals(this.fetchText('#todo-count strong'), '0', 'All todos completed, left list count is 0');
});

// Undo one completed todo and re-complete all todos
casper.then(function () {
	this.evaluate(function() {
		document.querySelector('#todo-list li:nth-child(2) input[type=checkbox]').click();
	});

	this.test.assertEquals(this.fetchText('#todo-count strong'), '1', 'Todo #2 un-completed, left list count is 1');

	this.evaluate(function() {
		document.querySelector('#toggle-all').click();
	});

	this.test.assertEquals(this.fetchText('#todo-count strong'), '0', 'All todos completed, left list count is 0');
});

// Undo all completed todo
casper.then(function () {
	this.evaluate(function() {
		document.querySelector('#toggle-all').click();
	});

	this.test.assertEquals(this.fetchText('#todo-count strong'), '2', 'All todos un-completed, left list count is 2');
});

// Complete all one by one and check toggle-all button uncomplete them all
casper.then(function () {
	this.evaluate(function() {
		document.querySelector('#todo-list li:nth-child(1) input[type=checkbox]').click();
		document.querySelector('#todo-list li:nth-child(2) input[type=checkbox]').click();
	});

	this.test.assertEquals(this.fetchText('#todo-count strong'), '0', 'All todos completed one by one, left list count is 0');

	this.evaluate(function() {
		document.querySelector('#toggle-all').click();
	});

	this.test.assertEquals(this.fetchText('#todo-count strong'), '2', 'All todos un-completed, left list cound is 2');
});

casper.run(function () {
	this.test.renderResults(true);
});

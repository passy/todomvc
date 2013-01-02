
var casper = require('casper').create();

// test URL : '../architecture-examples/angularjs/index.html';
var URL = casper.cli.get(0);

casper.addTodo = function(title) {
	// TODO about initial focus testing
	this.page.sendEvent('keydown', title);
	// TODO remove one, but keep which event ? Jquery impl prefers keyup...
	this.page.sendEvent('keydown', this.page.event.key.Enter);
	this.page.sendEvent('keyup', this.page.event.key.Enter);
};

casper.assertItemCount = function(itemsNumber, message) {
	this.test.assertEval(function (itemsNumber) {
		return document.querySelectorAll('#todo-list li').length === itemsNumber;
	}, message, {itemsNumber: itemsNumber});
}

casper.assertLeftItemsCount = function(count, message) {
	var displayedString = this.fetchText('#todo-count').replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim();
	var leftItemsString = count + ' item' + (count !== 1 ? 's' : '') + ' left';

	if (count === 0) {
		if (displayedString.length > 1 && displayedString !== leftItemsString) {
			this.test.fail(message);
		}
	} else {
		this.test.assertEquals(displayedString, leftItemsString, message);
	}
};

// TODO find why most times useless
// TODO remove localstorage instead
casper.clean = function() {
	this.evaluate(function() {
		document.querySelector('#clear-completed').click();
	});
	this.evaluate(function() {
		document.querySelector('#toggle-all').click();
	});
	this.evaluate(function() {
		document.querySelector('#clear-completed').click();
	});
};

casper.start(URL, function () {
	this.clean();

	this.test.assertTitleMatch(/TodoMVC$/, 'Page title contains TodoMVC');

	this.assertItemCount(0 , 'No todo at start');

	this.assertLeftItemsCount(0, 'Left todo list count is 0');

	this.test.assertNotVisible('#main', '#main section is hidden');
	this.test.assertNotVisible('#toggle-all', '#toggle-all checkbox is hidden');
	this.test.assertNotVisible('#todo-count', '#todo-count span is hidden');
});

// Create a first todo
casper.then(function () {
	this.addTodo('Some Task');

	this.assertItemCount(1, 'One todo has been added, list contains 1 item');

	this.assertLeftItemsCount(1, 'Left todo list count is 1');

	this.test.assertEquals(this.fetchText('#todo-list li:first-child label'), 'Some Task', 'First todo is "Some Task"');

	this.test.assertVisible('#main', '#main section is displayed');
	this.test.assertVisible('#toggle-all', '#toggle-all checkbox is displayed');
	this.test.assertVisible('#todo-count', '#todo-count span is displayed');
});

// Create a second todo
casper.then(function () {
	// let's test trim()
	this.addTodo(' Some Another Task ');

	this.assertItemCount(2, 'A second todo has been added, list contains 2 items');

	this.assertLeftItemsCount(2, 'Left todo list count is 2');

	this.test.assertEquals(this.fetchText('#todo-list li:nth-child(2) label'), 'Some Another Task', 'Second todo is "Some Another Task"');
});

// Create a third todo and complete second
casper.then(function () {
	this.addTodo('A Third Task');

	this.assertLeftItemsCount(3, 'One todo has been added, left todo list count is 3');

	this.test.assertNotVisible('#clear-completed', '#clear-completed button is hidden');

	this.click('#todo-list li:nth-child(2) input[type=checkbox]');

	this.assertLeftItemsCount(2, 'Todo #2 has been completed, left todo list count is 2');

	// TODO check button string
	this.test.assertVisible('#clear-completed', '#clear-completed button is displayed');

	this.assertItemCount(3, 'List still contains 3 items');
});

// Remove completed todo
casper.then(function () {
	this.click('#clear-completed');

	this.assertLeftItemsCount(2, 'Todo #2 has been removed, left todo list count is still 2');

	this.test.assertEquals(this.fetchText('#todo-list li:nth-child(2) label'), 'A Third Task', 'Second left todo is previous third one');

	this.test.assertNotVisible('#clear-completed', '#clear-completed button is hidden once again');

	this.assertItemCount(2, 'List contains 2 items');
});

// Complete all todos
casper.then(function () {
	this.click('#toggle-all');

	this.assertLeftItemsCount(0, 'All todos completed, left list count is 0');
});

// Undo one completed todo and re-complete all todos
casper.then(function () {
	this.click('#todo-list li:nth-child(2) input[type=checkbox]');

	this.assertLeftItemsCount(1, 'Todo #2 un-completed, left list count is 1');

	this.click('#toggle-all');

	this.assertLeftItemsCount(0, 'All todos completed, left list count is 0');
});

// Undo all completed todo
casper.then(function () {
	this.click('#toggle-all');

	this.assertLeftItemsCount(2, 'All todos un-completed, left list count is 2');
});

// Complete all one by one and check toggle-all button uncomplete them all
casper.then(function () {
	this.click('#todo-list li:nth-child(1) input[type=checkbox]');
	this.click('#todo-list li:nth-child(2) input[type=checkbox]');

	// TODO checkbox should be checked
	this.assertLeftItemsCount(0, 'All todos completed one by one, left list count is 0');

	this.click('#toggle-all');

	this.assertLeftItemsCount(2, 'All todos un-completed, left list cound is 2');
});

casper.run(function () {
	this.test.renderResults(true);
});

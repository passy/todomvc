/*global angular */
/*jshint unused:false */
'use strict';

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
var todomvc = angular.module('todomvc', ['ngRoute'])
	.config(function ($routeProvider) {
		$routeProvider.when('/', {
			controller: 'TodoCtrl'
		}).when('/:status', {
			controller: 'TodoCtrl'
		}).otherwise({
			redirectTo: '/'
		});
	}).run(function ($route) {});

/* App Controllers */

var todomvc = angular.module('todomvc', []);


todomvc.factory( 'todoStorage', function() {
  var STORAGE_ID = 'todos-angularjs';

  return {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    },

    put: function( todos ) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
    }
  };
});


todomvc.controller( 'TodoCtrl', function TodoCtrl( $scope, $location, todoStorage, filterFilter ) {
  var todos = $scope.todos = todoStorage.get();

  $scope.newTodo = "";
  $scope.editedTodo = null;

  $scope.$watch('todos', function() {
    $scope.remainingCount = filterFilter(todos, {completed: false}).length;
    $scope.doneCount = todos.length - $scope.remainingCount;
    $scope.allChecked = !$scope.remainingCount
    todoStorage.put(todos);
  }, true);

  if ( $location.path() === '' ) $location.path('/');
  $scope.location = $location;

  $scope.$watch( 'location.path()', function( path ) {
    $scope.statusFilter = (path == '/active') ?
      { completed: false } : (path == '/completed') ?
        { completed: true } : null;
  });


  $scope.addTodo = function() {
    if ( !$scope.newTodo.length ) return;

    todos.push({
      title: this.newTodo,
      completed: false
    });

    this.newTodo = '';
  };


  $scope.editTodo = function( todo ) {
    $scope.editedTodo = todo;
  };


  $scope.doneEditing = function( todo ) {
    $scope.editedTodo = null;
    if ( !todo.title ) $scope.removeTodo(todo);
  };


  $scope.removeTodo = function(todo) {
    todos.splice(todos.indexOf(todo), 1);
  };


  $scope.clearDoneTodos = function() {
    $scope.todos = todos = todos.filter(function(val) {
      return !val.completed;
    });
  };


  $scope.markAll = function( done ) {
    todos.forEach(function( todo ) {
      todo.completed = done;
    });
  };
});

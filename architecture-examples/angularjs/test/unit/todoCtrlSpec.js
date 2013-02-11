(function () {
'use strict';

describe( 'Todo Controller', function () {
	var ctrl, scope;

		// Load the module containing the app, only 'ng' is loaded by default.
	beforeEach( module( 'todomvc' ) );

	beforeEach( inject( function ( $controller, $rootScope ) {
		scope = $rootScope.$new();
		ctrl = $controller( 'TodoCtrl', { $scope: scope } );
	}));

	it( 'should not have an edited Todo on start', function () {
		expect( scope.editedTodo ).toBeNull();
	} );

	it( 'should not have any Todos on start', function () {
		expect( scope.todos.length ).toBe(0);
	} );

	describe( 'the path', function () {
		it( 'should default to "/"', function () {
			expect( scope.location.path() ).toBe( '/' );
		} );

		describe( 'being at /active', function () {
			it( 'should filter non-completed', inject( function ( $controller ) {
				ctrl = $controller( 'TodoCtrl', {
					$scope: scope,
					$location: {
						path: function () { return '/active' }
					}
				} );

				scope.$digest();
				expect( scope.statusFilter.completed ).toBeFalsy();
			} ) );
		} );

		describe( 'being at /completed', function () {
			it( 'should filter completed', inject( function ( $controller ) {
				ctrl = $controller( 'TodoCtrl', {
					$scope: scope,
					$location: {
						path: function () { return '/completed' }
					}
				} );

				scope.$digest();
				expect( scope.statusFilter.completed ).toBeTruthy();
			} ) );
		} );
	} );

	describe( 'having some saved Todos', function () {
		var todoList = [ {
					'title': 'Uncompleted Item 0',
					'completed': false
				}, {
					'title': 'Uncompleted Item 1',
					'completed': false
				}, {
					'title': 'Uncompleted Item 2',
					'completed': false
				}, {
					'title': 'Completed Item 0',
					'completed': true
				}, {
					'title': 'Completed Item 1',
					'completed': true
		} ],
		todoStorage = {
			storage: {},
			get: function () {
				return todoList;
			},
			put: function ( value ) {
				this.storage = value;
			}
		};

		beforeEach( inject( function ($controller) {
			ctrl = $controller( 'TodoCtrl', {
				$scope: scope,
				todoStorage: todoStorage
			} );
			scope.$digest();
		} ) );

		it( 'should count Todos correctly', function () {
			expect( scope.todos.length ).toBe(5);
			expect( scope.remainingCount ).toBe(3);
			expect( scope.doneCount ).toBe(2);
			expect( scope.allChecked ).toBeFalsy();
		} );

		it( 'should save Todos to local storage', function () {
			expect( todoStorage.storage.length ).toBe(5);
		} );
	} );
});
}());

(function() {

	var module = angular.module('PlayerApp');

	module.controller('UserController', function($scope, $routeParams) {
		$scope.username = $routeParams.username;
	});

})();

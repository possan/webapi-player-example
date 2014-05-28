(function() {

	var module = angular.module('PlayerApp');

	module.controller('HomeController', function($scope, $routeParams) {
		$scope.id = $routeParams.id;
	});

})();

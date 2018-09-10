(function() {

	var module = angular.module('PlayerApp');

	module.controller('HTMLAppController', function($scope, $rootScope, API, PlayQueue, $routeParams) {
		$scope.bundle = $routeParams.bundle
		$scope.resource = $routeParams.resource
		$scope.identifier = $routeParams.identifier
		console.log("Route parameters", $routeParams)
	
	});

})();

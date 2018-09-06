(function() {

	var module = angular.module('PlayerApp');

	module.controller('HTMLAppController', function($scope, $rootScope, API, PlayQueue, $routeParams) {
		$scope.src = 'http://' + $routeParams.identifier + '.buddhalow.net'
		$scope.width = '100%'
		$scope.height = '100%'
	
	});

})();

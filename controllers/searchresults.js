(function() {

	var module = angular.module('PlayerApp');

	module.controller('SearchResultsController', function($scope, $location, $routeParams) {
		$scope.query = $location.search().q || '';
	});

})();

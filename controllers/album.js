(function() {

	var module = angular.module('PlayerApp');

	module.controller('AlbumController', function($scope, $routeParams) {
		$scope.album = $routeParams.album;
	});

})();

(function() {

	var module = angular.module('PlayerApp');

	module.controller('ArtistController', function($scope, $routeParams) {
		$scope.artist = $routeParams.artist;
	});

})();

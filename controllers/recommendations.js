(function() {

	var module = angular.module('PlayerApp');

	module.controller('RecommendationsController', function($scope, API, $location, $routeParams, PlayQueue, $routeParams) {
		$scope.query = $routeParams.identifier;
		$scope.tracks = [];

		$scope.data = {
			type: 'recommendations',
			name: 'Recommendations',
			for_: {
				id: ''
			}
		}
		API.getRecommendations({
			seed_tracks: $scope.identifier
		}).then(function (results) {

		})

	
	});

})();

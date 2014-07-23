(function() {

	var module = angular.module('PlayerApp');

	module.controller('SearchResultsController', function($scope, API, $location, PlayQueue, $routeParams) {
		$scope.query = $location.search().q || '';
		$scope.tracks = [];

		API.getSearchResults($scope.query).then(function(results) {
			console.log('got search results', results);
			$scope.tracks = results.tracks.items;
		});

		$scope.play = function(trackuri) {
			var trackuris = $scope.tracks.map(function(track) {
				return track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(trackuris.indexOf(trackuri));
		}
	});

})();

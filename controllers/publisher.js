(function() {

	var module = angular.module('PlayerApp');

	module.controller('PublisherController', function($scope, API, $location, $routeParams, PlayQueue, $routeParams) {
		$scope.query = $routeParams.identifier;
		$scope.tracks = [];

		$scope.data = {
			id: $scope.query,
			type: 'publisher',
			name: $scope.query,
			uri: 'spotify:publisher:' + $scope.query,
			images: [{

			}]
		}

		API.findShows($scope.query).then(function(results) {
			console.log('got search results', results);
			$scope.shows = results.shows.items;
			if ($scope.shows.length > 0) {
				$scope.data.images = $scope.shows[0].images
			}
			$scope.digest()
		});

		$scope.play = function(trackuri) {
			var trackuris = $scope.tracks.map(function(track) {
				return track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(trackuris.indexOf(trackuri));
		};

		$scope.toggleFromYourMusic = function(index) {
			if ($scope.tracks[index].inYourMusic) {
				API.removeFromMyTracks([$scope.tracks[index].id]).then(function(response) {
					$scope.tracks[index].inYourMusic = false;
				});
			} else {
				API.addToMyTracks([$scope.tracks[index].id]).then(function(response) {
					$scope.tracks[index].inYourMusic = true;
				});
			}
		};
	});

})();

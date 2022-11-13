(function() {

	var module = angular.module('PlayerApp');

	module.controller('SearchResultsController', function($scope, API, $location, PlayQueue, $routeParams) {
		$scope.query = $location.search().q || '';
		$scope.type = $location.search().type || null;
		$scope.tracks = [];
		$scope.data = {
			type: 'search',
			name: 'Search results for \'' + $scope.query + '\''
		}
		API.getSearchResults($scope.query).then(function(results) {
			console.log('got search results', results);
			if ($scope.type) {
				$scope.objects = results[$scope.type + 's'].items;
				$scope.data = {
					type: 'search',
					name: 'Search results for \'' + $scope.query + '\' in \'' + $scope.type + '\''
				}
			}
			$scope.tracks = results.tracks.items.slice(0, 5);
			$scope.playlists = results.playlists.items.slice(0, 5);
			$scope.artists = results.artists.items.slice(0, 5);
			$scope.albums = results.albums.items.slice(0, 5);
			$scope.shows = results.shows.items.slice(0, 5);
			$scope.episodes = results.episodes.items.slice(0, 5);

			// find out if they are in the user's collection
			var ids = $scope.tracks.map(function(track) {
				return track.id;
			});

			API.containsUserTracks(ids).then(function(results) {
				results.forEach(function(result, index) {
					$scope.tracks[index].inYourMusic = result;
				});
			});

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

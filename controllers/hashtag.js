(function() {

	var module = angular.module('PlayerApp');

	module.controller('HashtagController', function($scope, API, $location, PlayQueue, $routeParams) {
		$scope.hashtag = $routeParams.hashtag
		$scope.type = $location.search().type || null;
		$scope.tracks = [];
		$scope.data = {
			type: 'hastag',
			name: '#' + $scope.hashtag + ''
		}
		API.getSearchResults('#' + $scope.hashtag).then(function(results) {
			console.log('got search results', results);
			if ($scope.type) {
				$scope.objects = results[$scope.type + 's'].items;
				$scope.data = {
					type: 'hashtag',
					name: '#' + $scope.hashtag + ' in \'' + $scope.type + '\''
				}
			}
		/*	$scope.tracks = results.tracks.items.slice(0, 5);
			$scope.playlists = results.playlists.items.slice(0, 5);
			$scope.artists = results.artists.items.slice(0, 5);
			$scope.albums = results.albums.items.slice(0, 5);*/
			$scope.shows = results.shows.items.slice(0, 5);
			$scope.episodes = results.episodes.items.slice(0, 5);


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

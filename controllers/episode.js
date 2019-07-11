(function() {

	var module = angular.module('PlayerApp');

	module.controller('EpisodeController', function($scope, $rootScope, API, PlayQueue, $routeParams) {
		$scope.identifier = $routeParams.identifier;
		$scope.data = null;
		$scope.release_year = '';
		$scope.total_duration = 0;
		$scope.num_discs = 0;
		$scope.tracks = [];
		$scope.similarTracks = []
		$scope.showAll = false
		$scope.toggleShowAll = function () {
			$scope.showAll = !$scope.showAll
		}
		API.getEpisodeById($scope.identifier).then(function(track) {
			console.log('got track', track);
			$scope.type = 'episode'

			$scope.release_year = '';

			$scope.data = track
			$scope.data.images = track.show.images
			$scope.data.authors = [{
				name: track.show.publisher,
				id: track.show.publisher,
				type: 'publisher'
			}]
			$scope.data.show.authors = [{
				name: track.show.publisher,
				id: track.show.publisher,
				type: 'publisher'
			}]
			$scope.tracks.push($scope.data)
			let img = document.createElement('img')
			img.crossOrigin = "Anonymous";
			img.src = $scope.data.images && $scope.data.images.length > 0 ? $scope.data.images[0].url : ''

			img.addEventListener('load', function() {
	   			var vibrant = new Vibrant(img);

	   			var swatches = vibrant.swatches()
	   			let i = 0;
			    for (var swatch in swatches) {
			        if (i == 1) {
			        	if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
				        	let hex = swatches[swatch].getHex()
				            console.log(swatch, hex)
				            document.documentElement.style.setProperty('--vibrant-color', hex + '55')
				         	break;   
				        }
				    }
			        i++
			    }
			});
			API.getEpisodesInShow($scope.data.show.id).then(function (episodes) {
				$scope.data.show.episodes = episodes.items.slice(0, 5)
		
			})
		});

		$scope.currenttrack = PlayQueue.getCurrent();
		$rootScope.$on('playqueuechanged', function() {
			$scope.currenttrack = PlayQueue.getCurrent();
		});

		$scope.play = function(trackuri) {
			var trackuris = $scope.tracks.map(function(track) {
				return track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(trackuris.indexOf(trackuri));
		};

		$scope.playall = function() {
			var trackuris = $scope.tracks.map(function(track) {
				return track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(0);
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

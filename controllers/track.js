(function() {

	var module = angular.module('PlayerApp');

	module.controller('TrackController', function($scope, $rootScope, API, PlayQueue, $routeParams) {
		$scope.identifier = $routeParams.identifier;
		$scope.data = null;
		$scope.release_year = '';
		$scope.total_duration = 0;
		$scope.num_discs = 0;
		$scope.tracks = [];
		$scope.similarTracks = []

		API.getTrack($scope.identifier).then(function(track) {
			console.log('got track', track);
			$scope.type = track.album_type

			track.authors = track.artists
			track.album.authors = track.album.artists

			$scope.release_year = '';

			if (track.album.release_date) {
				$scope.release_year = track.album.release_date.substring(0, 4); // så fult!
			}
			$scope.data = track
			$scope.data.images = track.album.images
			$scope.data.authors = track.album.authors
			$scope.data.authorIds = track.artists.map(o => o.id).join(',')
		
			API.getAudioAnalysisForTrack($scope.identifier).then(function (features) {
				$scope.data.features = features
			})
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

(function() {

	var module = angular.module('PlayerApp');

	module.controller('AlbumController', function($scope, $rootScope, API, Auth, PlayQueue, $routeParams) {
		$scope.album = $routeParams.album;
		$scope.data = null;
		$scope.release_year = '';
		$scope.total_duration = 0;
		$scope.num_discs = 0;
		$scope.tracks = [];

		API.getAlbum($scope.album).then(function(album) {
			console.log('got album', album);
			$scope.data = album;
			$scope.type = album.album_type

			album.authors = album.artists


			$scope.release_year = '';

			if (album.release_date) {
				$scope.release_year = album.release_date.substring(0, 4); // så fult!
			}
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
			API.getArtistAlbums($scope.data.artists[0].id, Auth.getUserCountry()).then(function (albums) {
				$scope.albums = albums.items.map(o => {
					o.authors = o.artists
					return o
				}).slice(0, 5)
			})
		});

		API.getAlbumTracks($scope.album).then(function(tracks) {
			console.log('got album tracks', tracks);

			// split into discs
			var discs = [];
			var disc = { disc_number: 1, tracks: [] };
			var tot = 0;
			tracks.items.forEach(function(track) {
				tot += track.duration_ms;
				if (track.disc_number != disc.disc_number) {
					discs.push(disc);
					disc = { disc_number: track.disc_number, tracks: [] };
				}
				disc.tracks.push(track);

				track.popularity = 0;
			});
			discs.push(disc);
			console.log('discs', discs);
			$scope.discs = discs;
			$scope.tracks = tracks.items;
			$scope.num_discs = discs.length;
			$scope.total_duration = tot;

			// find out if they are in the user's collection
			var ids = $scope.tracks.map(function(track) {
				return track.id;
			});


			API.getTracks(ids).then(function(results) {
				results.tracks.forEach(function(result, index) {
					$scope.tracks[index].popularity = result.popularity;
				});
			});

			API.containsUserTracks(ids).then(function(results) {
				results.forEach(function(result, index) {
					$scope.tracks[index].inYourMusic = result;
				});
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

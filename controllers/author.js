(function() {

	var module = angular.module('PlayerApp');

	module.controller('AuthorController', function($scope, $rootScope, API, PlayQueue, $routeParams, Auth) {
		$scope.artist = $routeParams.artist;
		$scope.data = null;
		$scope.discog = [];
		$scope.albums = [];
		$scope.singles = [];
		$scope.appearson = [];

		$scope.currenttrack = PlayQueue.getCurrent();
		$scope.isFollowing = false;
		$scope.isFollowHovered = false;
		$rootScope.$on('playqueuechanged', function() {
			$scope.currenttrack = PlayQueue.getCurrent();
		});

		API.getArtist($scope.artist).then(function(artist) {
			console.log('got artist', artist);
			$scope.data = artist;
			$scope.data.type = 'author'
			let img = document.createElement('img');
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
				            document.documentElement.style.setProperty('--vibrant-color', hex + '88')
				         	break;   
				        }
				    }
			        i++
			    }
			});
		});

		API.getArtistTopTracks($scope.artist, Auth.getUserCountry()).then(function(toptracks) {
			console.log('got artist', toptracks);
			$scope.toptracks = toptracks.tracks;

			var ids = $scope.toptracks.map(function(track) {
				return track.id;
			});

			API.containsUserTracks(ids).then(function(results) {
				results.forEach(function(result, index) {
					$scope.toptracks[index].inYourMusic = result;
				});
			});
		});

		API.getArtistAlbums($scope.artist, Auth.getUserCountry()).then(function(albums) {
			console.log('got artist albums', albums);
			$scope.albums = [];
			$scope.singles = [];
			$scope.appearson = [];
			albums.items.forEach(function(album) {
				console.log(album);
				if (album.album_type == 'album') {
					$scope.albums.push(album);
				}
				if (album.album_type == 'single') {
					$scope.singles.push(album);
				}
				if (album.album_type == 'appears-on') {
					$scope.appearson.push(album);
				}
			})
		});

		API.isFollowing($scope.artist, "artist").then(function(booleans) {
			console.log("Got following status for artist: " + booleans[0]);
			$scope.isFollowing = booleans[0];
		});

		$scope.playtoptrack = function(trackuri) {
			var trackuris = $scope.toptracks.map(function(track) {
				return track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(trackuris.indexOf(trackuri));
		};

		$scope.playall = function(trackuri) {
			var trackuris = $scope.toptracks.map(function(track) {
				return track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(0);
		};

		$scope.follow = function(isFollowing) {
			if (isFollowing) {
				API.unfollow($scope.artist, "artist").then(function() {
					$scope.isFollowing = false;
					$scope.data.followers.total--;
				});
			} else {
				API.follow($scope.artist, "artist").then(function() {
					$scope.isFollowing = true;
					$scope.data.followers.total++;
				});
			}
		};

		$scope.toggleFromYourMusic = function(index) {
			if ($scope.toptracks[index].inYourMusic) {
				API.removeFromMyTracks([$scope.toptracks[index].id]).then(function(response) {
					$scope.toptracks[index].inYourMusic = false;
				});
			} else {
				API.addToMyTracks([$scope.toptracks[index].id]).then(function(response) {
					$scope.toptracks[index].inYourMusic = true;
				});
			}
		};

	});

})();

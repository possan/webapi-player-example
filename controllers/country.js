(function() {

	var module = angular.module('PlayerApp');

	module.controller('CountryController', function($scope, $rootScope, API, PlayQueue, $routeParams, Auth) {
		$scope.identifier = $routeParams.identifier;
		$scope.data = {
			id: $scope.identifier,
			name: $scope.identifier,
			type: 'country',
			images: []
		}
		$scope.discog = [];
		$scope.albums = [];
		$scope.singles = [];
		$scope.appearson = [];
		$scope.artists = []

		$scope.currenttrack = PlayQueue.getCurrent();
		$scope.isFollowing = false;
		$scope.isFollowHovered = false;
		$rootScope.$on('playqueuechanged', function() {
			$scope.currenttrack = PlayQueue.getCurrent();
		});


        document.documentElement.style.setProperty('--vibrant-color','#88888888')
			      
		

		API.getSearchResults('country:' + $scope.identifier, Auth.getUserCountry()).then(function(results) {
			console.log('got year', $scope.identifier);
			$scope.toptracks = results.tracks.items;
			let albums = results.albums
			let artists = results.artists
			var ids = $scope.toptracks.map(function(track) {
				return track.id;
			});
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
			$scope.artists = artists.items

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

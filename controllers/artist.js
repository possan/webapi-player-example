(function() {

	var module = angular.module('PlayerApp');

	module.controller('ArtistController', function($scope, $rootScope, API, PlayQueue, $routeParams) {
		$scope.artist = $routeParams.artist;
		$scope.data = null;
		$scope.discog = [];
		$scope.albums = [];
		$scope.singles = [];
		$scope.appearson = [];

		$scope.currenttrack = PlayQueue.getCurrent();
		$rootScope.$on('playqueuechanged', function() {
			$scope.currenttrack = PlayQueue.getCurrent();
		});

		API.getArtist($scope.artist).then(function(artist) {
			console.log('got artist', artist);
			$scope.data = artist;
			$scope.$apply();
		});

		API.getArtistTopTracks($scope.artist, 'SE').then(function(toptracks) {
			console.log('got artist', toptracks);
			$scope.toptracks = toptracks.tracks;
			$scope.$apply();
		});

		API.getArtistAlbums($scope.artist).then(function(albums) {
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
			$scope.$apply();
		});

		$scope.playtoptrack = function(trackuri) {
			var trackuris = $scope.toptracks.map(function(track) {
				return track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(trackuris.indexOf(trackuri));
		}
	});

})();

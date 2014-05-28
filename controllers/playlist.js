(function() {

	var module = angular.module('PlayerApp');

	module.controller('PlaylistController', function($scope, API, PlayQueue, $routeParams) {
		$scope.playlist = $routeParams.playlist;
		$scope.username = $routeParams.username;
		$scope.name = '';
		$scope.tracks = [];

		$scope.currenttrack = PlayQueue.getCurrent();
		$scope.$on('playqueuechanged', function() {
			$scope.currenttrack = PlayQueue.getCurrent();
		});

		API.getPlaylist($scope.username, $scope.playlist).then(function(list) {
			console.log('got playlist', list);
			$scope.name = list.name;
			// $scope.tracks = list.tracks;
		});

		API.getPlaylistTracks($scope.username, $scope.playlist).then(function(list) {
			console.log('got playlist tracks', list);
			$scope.tracks = list.items;
		});

		$scope.play = function(trackuri) {
			var trackuris = $scope.tracks.map(function(track) {
				return track.track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(trackuris.indexOf(trackuri));
		}
	});

})();

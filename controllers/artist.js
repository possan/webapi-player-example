(function() {

	var module = angular.module('PlayerApp');

	module.controller('ArtistController', function($scope, $routeParams) {
		$scope.artist = $routeParams.artist;

		$scope.currenttrack = PlayQueue.getCurrent();
		$rootScope.$on('playqueuechanged', function() {
			$scope.currenttrack = PlayQueue.getCurrent();
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

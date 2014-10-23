(function() {

	var module = angular.module('PlayerApp');

	module.controller('UserController', function($scope, $routeParams, API) {
		$scope.username = $routeParams.username;
		$scope.data = null;
		$scope.playlistError = null;

		API.getUser($scope.username).then(function(user) {
			console.log('got user', user);
			$scope.data = user;
		});

		API.getPlaylists($scope.username).then(function(userplaylists){
			console.log('got user playlists', userplaylists);
			$scope.userplaylists = userplaylists;
		}, function(reason){
			console.log("got error", reason);
			$scope.playlistError = true;
		});


	});

})();

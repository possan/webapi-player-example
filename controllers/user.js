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

		API.isFollowing($scope.username, "user").then(function(booleans) {
			console.log("Got following status for user: " + booleans[0]);
			$scope.isFollowing = booleans[0];
		});

		$scope.follow = function(isFollowing) {
			if (isFollowing) {
				API.unfollow($scope.username, "user").then(function() {
					$scope.isFollowing = false;
				});
			} else {
				API.follow($scope.username, "user").then(function() {
					$scope.isFollowing = true;
				});
			}
		};

	});

})();

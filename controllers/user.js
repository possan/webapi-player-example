(function() {

	var module = angular.module('PlayerApp');

	module.controller('UserController', function($scope, $routeParams, API) {
		$scope.profileUsername = $routeParams.username;
		$scope.data = null;
		$scope.playlistError = null;
		$scope.isFollowing = false;
		$scope.isFollowHovered = false;

		API.getUser($scope.profileUsername).then(function(user) {
			console.log('got user', user);
			$scope.data = user;
		});

		API.getPlaylists($scope.profileUsername).then(function(userplaylists){
			console.log('got user playlists', userplaylists);
			$scope.userplaylists = userplaylists;
		}, function(reason){
			console.log("got error", reason);
			$scope.playlistError = true;
		});

		API.isFollowing($scope.profileUsername, "user").then(function(booleans) {
			console.log("Got following status for user: " + booleans[0]);
			$scope.isFollowing = booleans[0];
		});

		$scope.follow = function(isFollowing) {
			if (isFollowing) {
				API.unfollow($scope.profileUsername, "user").then(function() {
					$scope.isFollowing = false;
					$scope.data.followers.total--;
				});
			} else {
				API.follow($scope.profileUsername, "user").then(function() {
					$scope.isFollowing = true;
					$scope.data.followers.total++;
				});
			}
		};

	});

})();

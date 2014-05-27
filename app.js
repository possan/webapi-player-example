(function() {

	var module = angular.module('PlayerApp', []);

	module.controller('AppController', function($scope, Auth, API) {
		console.log('in AppController');

		console.log(location);

		// check for accesstoken redirect

		var hash = {};
		location.hash.replace(/^#/, '').split('&').forEach(function(kv) {
			var spl = kv.indexOf('=');
			if (spl != -1) {
				hash[kv.substring(0, spl)] = decodeURIComponent(kv.substring(spl+1));
			}
		});
		console.log('initial hash', hash);
		if (hash.access_token) {
			Auth.setAccessToken(hash.access_token, hash.expires_in || 60);
			API.getMyUsername().then(function(username) {
				Auth.setUsername(username);
				$scope.$emit('login');
				location = '#'; // hide accesstoken
			});
		}

		$scope.isLoggedIn = (Auth.getAccessToken() != '');

		$scope.showplayer = $scope.isLoggedIn;
		$scope.showlogin = !$scope.isLoggedIn;

		$scope.$on('login', function() {
			$scope.showplayer = true;
			$scope.showlogin = false;
		});

		$scope.$on('logout', function() {
			$scope.showplayer = false;
			$scope.showlogin = true;
		});
	});

})();

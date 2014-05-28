(function() {

	var module = angular.module('PlayerApp', ['ngRoute']);

	module.config(function($routeProvider) {
		$routeProvider.
			when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'HomeController'
			}).
			when('/playqueue', {
				templateUrl: 'partials/playqueue.html',
				controller: 'PlayQueueController'
			}).
			when('/users/:username', {
				templateUrl: 'partials/user.html',
				controller: 'UserController'
			}).
			when('/users/:username/playlists/:playlist', {
				templateUrl: 'partials/playlist.html',
				controller: 'PlaylistController'
			}).
			when('/artists/:artist', {
				templateUrl: 'partials/artist.html',
				controller: 'ArtistController'
			}).
			when('/albums/:album', {
				templateUrl: 'partials/album.html',
				controller: 'AlbumController'
			}).
			when('/search', {
				templateUrl: 'partials/searchresults.html',
				controller: 'SearchResultsController'
			}).
			otherwise({
				redirectTo: '/'
			});
	});

	module.controller('AppController', function($scope, Auth, API, $location) {
		console.log('in AppController');

		console.log(location);

		// check for accesstoken redirect

		var hash = {};
		location.hash.replace(/^#\/?/, '').split('&').forEach(function(kv) {
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

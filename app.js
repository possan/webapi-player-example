(function() {

	var module = angular.module('PlayerApp', ['ngRoute']);

	module.config(function($routeProvider) {
		$routeProvider.
			when('/', {
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

		function checkUser() {
			API.getMe().then(function(userInfo) {
				Auth.setUsername(userInfo.id);
				Auth.setUserCountry(userInfo.country);
				$scope.$emit('login');
				$scope.$apply();
				$location.replace();
			}, function(err) {
				$scope.showplayer = false;
				$scope.showlogin = true;
				$scope.$apply();
				$location.replace();
			});
		}

		window.addEventListener("message", function(event) {
			console.log('got postmessage', event);
			var hash = JSON.parse(event.data);
			if (hash.type == 'access_token') {
				Auth.setAccessToken(hash.access_token, hash.expires_in || 60);
				checkUser();
			}
  		}, false);

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

		checkUser();
	});

})();

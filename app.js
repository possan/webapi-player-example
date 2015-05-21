(function() {

	var app = angular.module('PlayerApp', ['ngRoute']);

	app.config(function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/browse.html',
				controller: 'BrowseController'
			}).
			when('/playqueue', {
				templateUrl: 'partials/playqueue.html',
				controller: 'PlayQueueController'
			}).
			when('/users/:username', {
				templateUrl: 'partials/user.html',
				controller: 'UserController'
			}).
			when('/users/:username/tracks', {
				templateUrl: 'partials/usertracks.html',
				controller: 'UserTracksController'
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
			when('/category/:categoryid', {
				templateUrl: 'partials/browsecategory.html',
				controller: 'BrowseCategoryController'
			}).
			otherwise({
				redirectTo: '/'
			});
	});

	app.controller('AppController', function($scope, Auth, API, $location) {
		console.log('in AppController');

		console.log(location);

		function checkUser(redirectToLogin) {
			API.getMe().then(function(userInfo) {
				Auth.setUsername(userInfo.id);
				Auth.setUserCountry(userInfo.country);
				if (redirectToLogin) {
					$scope.$emit('login');
					$location.replace();
				}
			}, function(err) {
				$scope.showplayer = false;
				$scope.showlogin = true;
				$location.replace();
			});
		}

		window.addEventListener("message", function(event) {
			console.log('got postmessage', event);
			var hash = JSON.parse(event.data);
			if (hash.type == 'access_token') {
				Auth.setAccessToken(hash.access_token, hash.expires_in || 60);
				checkUser(true);
			}
  		}, false);

		$scope.isLoggedIn = (Auth.getAccessToken() != '');
		$scope.showplayer = $scope.isLoggedIn;
		$scope.showlogin = !$scope.isLoggedIn;

		$scope.$on('login', function() {
			$scope.showplayer = true;
			$scope.showlogin = false;
			$location.path('/').replace().reload();
		});

		$scope.$on('logout', function() {
			$scope.showplayer = false;
			$scope.showlogin = true;
		});

		$scope.getClass = function(path) {
			if ($location.path().substr(0, path.length) == path) {
				return 'active';
			} else {
				return '';
			}
		};

		$scope.focusInput = false;
		$scope.menuOptions = function(playlist) {

			var visibilityEntry = [playlist.public ? 'Make secret' : 'Make public', function ($itemScope) {
				API.changePlaylistDetails(playlist.username, playlist.id, {public: !playlist.public})
					.then(function() {
						playlist.public = !playlist.public;
					});
			}];

			var own = playlist.username === Auth.getUsername();
			if (own) {
				return [
					visibilityEntry,
					null,
					['Rename', function ($itemScope) {
						playlist.editing = true;
						$scope.focusInput = true;
				}]
				];
			} else {
				return [ visibilityEntry ];
			}
		};

		$scope.playlistNameKeyUp = function(event, playlist) {
			if (event.which === 13) {
				// enter
				var newName = event.target.value;
				API.changePlaylistDetails(playlist.username, playlist.id, {name: newName})
					.then(function() {
						playlist.name = newName;
						playlist.editing = false;
						$scope.focusInput = false;
					});
			}

			if (event.which === 27) {
				// escape
				playlist.editing = false;
				$scope.focusInput = false;
			}
		};

		$scope.playlistNameBlur = function(playlist) {
			playlist.editing = false;
			$scope.focusInput = false;
		};

		checkUser();
	});

})();

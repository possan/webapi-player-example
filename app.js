(function() {

	var app = angular.module('PlayerApp', ['ngRoute']);

	app.factory('I18n', ['$q', '$http', function($q, $http) {
		let locale = navigator.language

		var lang = {}
		try {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', '/lang/' + locale + '.json', false)
			xhr.send(null)
			lang = JSON.parse(xhr.responseText)
		} catch (e) {

		}
		if (!lang) {
			return {}
		}
		var i18n = {
			t: function (input) {
				let translatedString = lang[input]
				if (!translatedString) {
					translatedString = input
				}
				let args = Array.from(arguments).slice(1)
				for (let i = 0; i < args.length; i++) {
					translatedString = translatedString.replace('%' + i, args[i])
				}
				return translatedString
			}
		}
		return i18n
	}])
	app.filter('trustThisUrl', ["$sce", function ($sce) {
        return function (val) {
            return $sce.trustAsResourceUrl(val);
        };
    }]);
    app.filter('locale', ['I18n', function(I18n) {
	  return function(input) {
	    return I18n.t(input, Array.from(arguments).slice(1))
	  };
	}])

	app.config(function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true)
		$routeProvider.
			when('/', {
				templateUrl: 'partials/browse.html',
				controller: 'BrowseController'
			}).
			when('/playqueue', {
				templateUrl: 'partials/playqueue.html',
				controller: 'PlayQueueController'
			}).
			when('/users?/:username', {
				templateUrl: 'partials/user.html',
				controller: 'UserController'
			}).
			when('/users?/:username/tracks', {
				templateUrl: 'partials/usertracks.html',
				controller: 'UserTracksController'
			}).
			when('/users?/:username/playlists/:playlist', {
				templateUrl: 'partials/playlist.html',
				controller: 'PlaylistController'
			}).
			when('/playlists?/:playlist', {
				templateUrl: 'partials/playlist.html',
				controller: 'PlaylistController'
			}).
			when('/shows?/:show', {
				templateUrl: 'partials/show.html',
				controller: 'ShowController'
			}).
			when('/artists?/:artist', {
				templateUrl: 'partials/artist.html',
				controller: 'ArtistController'
			}).
			when('/authors?/:artist', {
				templateUrl: 'partials/author.html',
				controller: 'AuthorController'
			}).
			when('/audiobooks?/:album', {
				templateUrl: 'partials/audiobook.html',
				controller: 'AudiobookController'
			}).
			when('/albums?/:album', {
				templateUrl: 'partials/album.html',
				controller: 'AlbumController'
			}).
			when('/search', {
				templateUrl: 'partials/searchresults.html',
				controller: 'SearchResultsController'
			}).
			when('/apps?/:bundle', {
				templateUrl: 'partials/app.html',
				controller: 'HTMLAppController'
			}).

			when('/apps?/:bundle/:resource', {
				templateUrl: 'partials/app.html',
				controller: 'HTMLAppController'
			}).
			when('/apps?/:bundle/:resource/:identifier', {
				templateUrl: 'partials/app.html',
				controller: 'HTMLAppController'
			}).
			when('/category/:categoryid', {
				templateUrl: 'partials/browsecategory.html',
				controller: 'BrowseCategoryController'
			}).
			when('/genres?/:identifier', {
				templateUrl: 'partials/genre.html',
				controller: 'GenreController'
			}).
			when('/labels?/:identifier', {
				templateUrl: 'partials/label.html',
				controller: 'LabelController'
			}).
			when('/tracks?/:identifier', {
				templateUrl: 'partials/track.html',
				controller: 'TrackController'
			}).
			when('/publishers?/:identifier', {
				templateUrl: 'partials/publisher.html',
				controller: 'PublisherController'
			}).
			when('/years?/:identifier', {
				templateUrl: 'partials/year.html',
				controller: 'YearController'
			}).
			when('/country/:identifier', {
				templateUrl: 'partials/country.html',
				controller: 'CountryController'
			}).
			when('/episodes?/:identifier', {
				templateUrl: 'partials/episode.html',
				controller: 'EpisodeController'
			}).
			when('/hashtags?/:hashtag', {
				templateUrl: 'partials/hashtag.html',
				controller: 'HashtagController'
			}).
			when('/charts?/:identifier', {
				templateUrl: 'partials/chart.html',
				controller: 'ChartController'
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

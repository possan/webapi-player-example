(function() {

	var module = angular.module('PlayerApp');

	module.controller('PlayerController', function($scope, $rootScope, Auth, API, PlayQueue, Playback, $location) {
		$scope.view = 'welcome';
		$scope.username = Auth.getUsername();
		$scope.playlists = [];
		$scope.playing = false;
		$scope.progress = 0;

		function updatePlaylists() {
			if ($scope.username != '') {
				API.getPlaylists(Auth.getUsername()).then(function(list) {
					$scope.playlists = list.items.map(function(pl) {
						return {
							id: pl.id,
							name: pl.name,
							uri: pl.uri,
							username: pl.owner.id,
							collaborative: pl.collaborative,
							'public': pl['public']
						};
					});
					$scope.$apply();
				});
			}
		}

		updatePlaylists();

		$scope.logout = function() {
			// do login!
			console.log('do logout...');
			Auth.setUsername('');
			Auth.setAccessToken('', 0);
			$scope.$emit('logout');
		}

		$scope.resume = function() {
			Playback.resume();
		}

		$scope.pause = function() {
			Playback.pause();
		}

		$scope.next = function() {
			PlayQueue.next();
			Playback.startPlaying(PlayQueue.getCurrent());
		}

		$scope.prev = function() {
			PlayQueue.prev();
			Playback.startPlaying(PlayQueue.getCurrent());
		}

		$scope.queue = function(trackuri) {
			PlayQueue.enqueue(trackuri);
		}

		$scope.showhome = function() {
			console.log('load home view');
		}

		$scope.showplayqueue = function() {
			console.log('load playqueue view');
		}

		$scope.showplaylist = function(playlisturi) {
			console.log('load playlist view', playlisturi);
		}

		$scope.query = '';

		$scope.loadsearch = function() {
			console.log('search for', $scope.query);
			$location.path('/search').search({ q: $scope.query }).replace();
		}

		$scope.$on('login', function() {
			$scope.username = Auth.getUsername();
			updatePlaylists();
		});

		$rootScope.$on('playqueuechanged', function() {
			console.log('PlayerController: play queue changed.');
		});

		$rootScope.$on('playerchanged', function() {
			console.log('PlayerController: player changed.');
			$scope.currenttrack = Playback.getTrack();
			$scope.playing = Playback.isPlaying();
			$scope.$apply(function() {
			});
		});

		$rootScope.$on('endtrack', function() {
			console.log('PlayerController: end track.');
			$scope.currenttrack = Playback.getTrack();
			$scope.playing = Playback.isPlaying();
			PlayQueue.next();
			Playback.startPlaying(PlayQueue.getCurrent());
			$scope.$apply(function() {
			});
		});

		$rootScope.$on('trackprogress', function() {
			console.log('PlayerController: trackprogress.');
			$scope.progress = Playback.getProgress();
			$scope.$apply(function() {
			});
		});
	});

})();

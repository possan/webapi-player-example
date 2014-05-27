(function() {

	var module = angular.module('PlayerApp');

	module.controller('PlayerController', function($scope, Auth, API, PlayQueue) {
		$scope.view = 'welcome';
		$scope.username = Auth.getUsername();
		$scope.playlists = [];

		function updatePlaylists() {
			if ($scope.username != '') {
				API.getPlaylists().then(function(list) {
					$scope.playlists = list.items.map(function(pl) {
						return {
							id: pl.id,
							name: pl.name,
							uri: pl.uri,
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
			$scope.$emit('logout');
		}

		$scope.play = function(trackuri) {
			PlayQueue.play(trackuri);
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

		$scope.$on('login', function() {
			$scope.username = Auth.getUsername();
			updatePlaylists();
		});

		$scope.$on('playqueuechanged', function() {
			console.log('PlayerController: play queue changed.');
		});

		$scope.$on('playerchanged', function() {
			console.log('PlayerController: player changed.');
		});
	});

})();

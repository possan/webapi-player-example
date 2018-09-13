(function() {

	var module = angular.module('PlayerApp');

	module.controller('ChartController', function($scope, $rootScope, API, PlayQueue, $routeParams, Auth, $sce) {
		$scope.playlist = $routeParams.identifier;
		$scope.username = $routeParams.username;
		$scope.name = '';
		$scope.tracks = [];
		$scope.data = null;
		$scope.total_duration = 0;

		$scope.currenttrack = PlayQueue.getCurrent();
		$scope.isFollowing = false;
		$scope.isFollowHovered = false;
		$scope.q = ''

		$rootScope.$on('playqueuechanged', function() {
			$scope.currenttrack = PlayQueue.getCurrent();
		});
		let promise = $scope.username ? API.getPlaylist($scope.username, $scope.playlist) : API.getPlaylistById($scope.playlist) 
		promise.then(function(list) {
			console.log('got playlist', list);
			$scope.name = list.name;
			$scope.data = list;
			$scope.username = list.owner.id
			$scope.data.authors = [list.owner]
			$scope.data.type = 'chart'
			$scope.data.description = $sce.trustAsHtml(list.description);
			let img = document.createElement('img')
			img.crossOrigin = "Anonymous";
			img.src = $scope.data.images && $scope.data.images.length > 0 ? $scope.data.images[0].url : ''
			img.addEventListener('load', function() {
	   			var vibrant = new Vibrant(img);

	   			var swatches = vibrant.swatches()
	   			let i = 0;

			    for (var swatch in swatches) {
			        if (i == 1) {
			        	if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
				        	let hex = swatches[swatch].getHex()
				            console.log(swatch, hex)
				            document.documentElement.style.setProperty('--vibrant-color', hex + '55')
				            console.log(hex)
	
				         	break;   
				        }
				    }
			        i++
			    }
			});
		});
		promise = $scope.username ? API.getPlaylistTracks($scope.username, $scope.playlist) : API.getTracksInPlaylistById($scope.playlist)
	
		API.getEpisodesInPlaylist($scope.playlist).then(results => {
			debugger
		})
		promise.then(function(list) {
			console.log('got playlist tracks', list);
			var tot = 0;
			list.items.forEach(function(track) {
				tot += track.track.duration_ms;
			});
			$scope.tracks = list.items;
			$scope.visibleTracks = $scope.tracks.filter(
				o => {
					
				}
			)
			console.log('tot', tot);
			$scope.total_duration = tot;

			// find out if they are in the user's collection
			var ids = $scope.tracks.map(function(track) {
				return track.track.id;
			});

			var i, j, temparray, chunk = 20;
			for (i = 0, j = ids.length; i < j; i += chunk) {
					temparray = ids.slice(i, i + chunk);
					var firstIndex = i;
					(function(firstIndex){
						API.containsUserTracks(temparray).then(function(results) {
							results.forEach(function(result, index) {
								$scope.tracks[firstIndex + index].track.inYourMusic = result;
							});
						});
					})(firstIndex);
			}
		});

		promise = $scope.username ? API.isFollowingPlaylist($scope.username, $scope.playlist) : API.isFollowingPlaylistById($scope.playlist)
		
		API.isFollowingPlaylist($scope.username, $scope.playlist).then(function(booleans) {
			console.log("Got following status for playlist: " + booleans[0]);
			$scope.isFollowing = booleans[0];
		});

		$scope.follow = function(isFollowing) {
			if (isFollowing) {
				let promise = $scope.username ? API.unfollowPlaylist($scope.username, $scope.playlist) : API.unfollowPlaylistById($scope.playlist)
				promise.then(function() {
					$scope.isFollowing = false;
					$rootScope.$emit('playlistsubscriptionchange');
				});
			} else {
				let promise = $scope.username ? API.followPlaylist($scope.username, $scope.playlist) : API.followPlaylistById($scope.playlist)
				promise.then(function () {
					$scope.isFollowing = true;
					$rootScope.$emit('playlistsubscriptionchange');
				});
			}
		};

		$scope.play = function(trackuri) {
			var trackuris = $scope.tracks.map(function(track) {
				return track.track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(trackuris.indexOf(trackuri));
		};

		$scope.playall = function() {
			var trackuris = $scope.tracks.map(function(track) {
				return track.track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(0);
		};

		$scope.toggleFromYourMusic = function(index) {
			if ($scope.tracks[index].track.inYourMusic) {
				API.removeFromMyTracks([$scope.tracks[index].track.id]).then(function(response) {
					$scope.tracks[index].track.inYourMusic = false;
				});
			} else {
				API.addToMyTracks([$scope.tracks[index].track.id]).then(function(response) {
					$scope.tracks[index].track.inYourMusic = true;
				});
			}
		};

		$scope.menuOptionsPlaylistTrack = function() {
			if ($scope.username === Auth.getUsername()) {
				return [[
					'Delete',
					function ($itemScope) {
						var position = $itemScope.$index;
						let promise = $scope.username ? API.removeTrackFromPlaylist(
							$scope.username,
							$scope.playlist,
							$itemScope.t.track, position) :
							API.removeTrackFromPlaylistById(
								$scope.playlist,
								$itemScope.t.track, position)

						promise.then(function() {
							$scope.tracks.splice(position, 1);
						});
					}]]
			} else {
				return null;
			}
		};

	});

})();

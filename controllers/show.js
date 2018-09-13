(function() {

	var module = angular.module('PlayerApp');

	module.controller('ShowController', function($scope, $rootScope, API, PlayQueue, $routeParams, Auth, $sce) {
		$scope.show = $routeParams.show;
		$scope.username = $routeParams.username;
		console.log($routeParams);
		$scope.name = '';
		$scope.episodes = [];
		$scope.data = null;
		$scope.total_duration = 0;

		$scope.currentepisode = PlayQueue.getCurrent();
		$scope.isFollowing = false;
		$scope.isFollowHovered = false;

		$rootScope.$on('playqueuechanged', function() {
			$scope.currentepisode = PlayQueue.getCurrent();
		});

		API.getShow($scope.show).then(function(list) {
			console.log('got show', list);
			$scope.name = list.name;
			$scope.data = list;
			$scope.data.showDescription = $sce.trustAsHtml(list.description);
			$scope.data.description = ''
			$scope.data.authors = [{
				id: $scope.data.publisher,
				name: $scope.data.publisher,
				type: 'publisher'
			}]

			let img = document.createElement('img');
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
				            document.documentElement.style.setProperty('--vibrant-color', hex + '88')
				         	break;   
				        }
				    }
			        i++
			    }
			});
		});

		API.getShowEpisodes($scope.show).then(function(list) {
			console.log('got show episodes', list);
			var tot = 0;
			list.items.forEach(function(episode) {
				tot += episode.duration_ms;
			});
			$scope.episodes = list.items;
			console.log('tot', tot);
			$scope.total_duration = tot;

			// find out if they are in the user's collection
			var ids = $scope.episodes.map(function(episode) {
				return episode.id;
			});

			var i, j, temparray, chunk = 20;
			for (i = 0, j = ids.length; i < j; i += chunk) {
				temparray = ids.slice(i, i + chunk);
				var firstIndex = i;
				(function(firstIndex){
					API.containsUserTracks(temparray).then(function(results) {
						results.forEach(function(result, index) {
							$scope.episodes[firstIndex + index].episode.inYourMusic = result;
						});
					});
				})(firstIndex);
			}
		});

	/*	API.isFollowingShow($scope.username, $scope.show).then(function(booleans) {
			console.log("Got following status for show: " + booleans[0]);
			$scope.isFollowing = booleans[0];
		});
*/
		$scope.follow = function(isFollowing) {
		/*	if (isFollowing) {
				API.unfollowShow($scope.username, $scope.show).then(function() {
					$scope.isFollowing = false;
					$rootScope.$emit('showsubscriptionchange');
				});
			} else {
				API.followShow($scope.username, $scope.show).then(function() {
					$scope.isFollowing = true;
					$rootScope.$emit('showsubscriptionchange');
				});
			}*/
		};

		$scope.play = function(episodeuri) {
			var episodeuris = $scope.episodes.map(function(episode) {
				return episode.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(episodeuris);
			PlayQueue.playFrom(episodeuris.indexOf(episodeuri));
		};

		$scope.playall = function() {
			var episodeuris = $scope.episodes.map(function(episode) {
				return episode.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(episodeuris);
			PlayQueue.playFrom(0);
		};

		$scope.toggleFromYourMusic = function(index) {
			if ($scope.episodes[index].episode.inYourMusic) {
				API.removeFromMyTracks([$scope.episodes[index].episode.id]).then(function(response) {
					$scope.episodes[index].episode.inYourMusic = false;
				});
			} else {
				API.addToMyTracks([$scope.episodes[index].episode.id]).then(function(response) {
					$scope.episodes[index].episode.inYourMusic = true;
				});
			}
		};

		$scope.menuOptionsShowTrack = function() {
			if ($scope.username === Auth.getUsername()) {
				return [[
					'Delete',
					function ($itemScope) {
						var position = $itemScope.$index;
						API.removeTrackFromShow(
							$scope.username,
							$scope.show,
							$itemScope.t.episode, position).then(function() {
								$scope.episodes.splice(position, 1);
							});
					}]]
			} else {
				return null;
			}
		};

	});

})();

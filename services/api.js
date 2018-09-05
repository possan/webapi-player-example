(function() {
	
	window.spotifyDeviceId = null
	window.spotifyDevices = []

	window.player = null

	var module = angular.module('PlayerApp');

	module.factory('API', function(Auth, $q, $http) {

		var baseUrl = 'https://api.spotify.com/v1';
		
		window.onSpotifyWebPlaybackSDKReady = () => {
	   		const token = Auth.getAccessToken();
		  	const player = new Spotify.Player({
		    	name: 'Thirtify',
		    	getOAuthToken: cb => { cb(token); }
		  	});

		  	// Error handling
		  	player.addListener('initialization_error', ({ message }) => { console.error(message); });
		  	player.addListener('authentication_error', ({ message }) => { console.error(message); });
		  	player.addListener('account_error', ({ message }) => { console.error(message); });
		  	player.addListener('playback_error', ({ message }) => { console.error(message); });

		  	// Playback status updates
		  	player.addListener('player_state_changed', state => { console.log(state); });

		  	// Ready
		  	player.addListener('ready', ({ device_id }) => {
		  		window.currentSpotifyDeviceId = device_id

		  		console.log('Ready with Device ID', window.currentSpotifyDeviceId);
		  	});

		  	// Not Ready
		  	player.addListener('not_ready', ({ device_id }) => {
		   	 	console.log('Device ID has gone offline', window.currentSpotifyDeviceId);
		  	});

		  	// Connect to the player!
		  	player.connect();
		  	window.player = player
		}
		return {

			getMe: function() {
				var ret = $q.defer();
				$http.get(baseUrl + '/me', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got userinfo', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to get userinfo', err);
					ret.reject(err);
				});
				return ret.promise;
			},

			getMyUsername: function() {
				var ret = $q.defer();
				$http.get(baseUrl + '/me', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got userinfo', r);
					//ret.resolve(r.id);
					ret.resolve('test_1');
				}).error(function(err) {
					console.log('failed to get userinfo', err);
					//ret.reject(err);
					//
					ret.resolve('test_1');
				});
				return ret.promise;
			},

			getMyTracks: function() {
				var ret = $q.defer();
				$http.get(baseUrl + '/me/tracks', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got user tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			containsUserTracks: function(ids) {
				var ret = $q.defer();
				$http.get(baseUrl + '/me/tracks/contains?ids=' + encodeURIComponent(ids.join(',')), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got contains user tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			addToMyTracks: function(ids) {
				var ret = $q.defer();
				$http.put(baseUrl + '/me/tracks?ids=' + encodeURIComponent(ids.join(',')), {}, {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got response from adding to my albums', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			removeFromMyTracks: function(ids) {
				var ret = $q.defer();
				$http.delete(baseUrl + '/me/tracks?ids=' + encodeURIComponent(ids.join(',')), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got response from removing from my tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getPlaylists: function(username) {
				var limit = 50;
				var ret = $q.defer();
				var playlists = [];

				$http.get(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists', {
					params: {
						limit: limit
					},
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					playlists = playlists.concat(r.items);

					var promises = [],
							total = r.total,
							offset = r.offset;

					while (total > limit + offset) {
						promises.push(
							$http.get(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists', {
								params: {
									limit: limit,
									offset: offset + limit
								},
								headers: {
									'Authorization': 'Bearer ' + Auth.getAccessToken()
								}
							})
						);
						offset += limit;
					};

					$q.all(promises).then(function(results) {
						results.forEach(function(result) {
							playlists = playlists.concat(result.data.items);
						})
						console.log('got playlists', playlists);
						ret.resolve(playlists);
					});

				}).error(function(data, status, headers, config) {
					ret.reject(status);
				});
				return ret.promise;
			},
			getPlaylistById: function (identifier) {
				var ret = $q.defer();
				$http.get(baseUrl + '/playlists/' + encodeURIComponent(identifier), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got playlists', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getPlaylist: function(username, playlist) {
				var ret = $q.defer();
				$http.get(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists/' + encodeURIComponent(playlist), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got playlists', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getShow: function(identifier) {
				var ret = $q.defer();
				$http.get(baseUrl + '/shows/' + encodeURIComponent(identifier), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got show', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getPlaylistTracks: function(username, playlist) {
				var ret = $q.defer();
				$http.get(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists/' + encodeURIComponent(playlist) + '/tracks', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got playlist tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},


			getShowEpisodes: function(identifier) {
				var ret = $q.defer();
				$http.get(baseUrl + '/shows/' + encodeURIComponent(identifier) + '/episodes', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got show episodes', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getTracksInPlaylistById: function(identifier) {
				var ret = $q.defer();
				$http.get(baseUrl + '/playlists/' + encodeURIComponent(identifier) + '/tracks', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got playlist tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},
			getEpisodesInShow: function(identifier) {
				var ret = $q.defer();
				$http.get(baseUrl + '/shows/' + encodeURIComponent(identifier) + '/episodes', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got episodes in show', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			changePlaylistDetails: function(username, playlist, options) {
				var ret = $q.defer();
				$http.put(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists/' + encodeURIComponent(playlist), options, {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got response after changing playlist details', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			changeDetailsOfPlaylistById: function(playlist, options) {
				var ret = $q.defer();
				$http.put(baseUrl + '/playlists/' + encodeURIComponent(playlist), options, {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got response after changing playlist details', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			removeTrackFromPlaylist: function(username, playlist, track, position) {
				var ret = $q.defer();
				$http.delete(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists/' + encodeURIComponent(playlist) + '/tracks',
					{
						data: {
							tracks: [{
								uri: track.uri,
								position: position
							}]
						},
						headers: {
							'Authorization': 'Bearer ' + Auth.getAccessToken()
						}
				}).success(function(r) {
					console.log('remove track from playlist', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			removeTrackFromPlaylistById: function(playlist, track, position) {
				var ret = $q.defer();
				$http.delete(baseUrl + '/playlists/' + encodeURIComponent(playlist) + '/tracks',
					{
						data: {
							tracks: [{
								uri: track.uri,
								position: position
							}]
						},
						headers: {
							'Authorization': 'Bearer ' + Auth.getAccessToken()
						}
				}).success(function(r) {
					console.log('remove track from playlist', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getTrack: function(trackid) {
				var ret = $q.defer();
				$http.get(baseUrl + '/tracks/' + encodeURIComponent(trackid), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got track', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getTracks: function(trackids) {
				var ret = $q.defer();
				$http.get(baseUrl + '/tracks/?ids=' + encodeURIComponent(trackids.join(',')), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getAlbum: function(albumid) {
				var ret = $q.defer();
				$http.get(baseUrl + '/albums/' + encodeURIComponent(albumid), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got album', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			playTracks: function (uris) {
				var ret = $q.defer();
				$http.put(baseUrl + '/me/player/player/play?device_id=' + window.currentSpotifyDeviceId + '/tracks', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					},
					body: JSON.stringify({
						uris: [uris]
					})
				}).success(function(r) {
					console.log('got album tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			seekPlayback(pos) {
				var ret = $q.defer();
				player.seek(pos * 1000);
				return ret.promise
				ret.resolve()
			},

			resumePlayback() {				
				var ret = $q.defer();
				player.resume().then(() => {});
				return ret.promise
				ret.resolve()
			},

			pausePlayback() {		
				var ret = $q.defer();
				player.pause().then(() => {});
				return ret.promise
				ret.resolve()				
			},

			getAlbumTracks: function(albumid) {
				var ret = $q.defer();
				$http.get(baseUrl + '/albums/' + encodeURIComponent(albumid) + '/tracks', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got album tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getArtist: function(artistid) {
				var ret = $q.defer();
				$http.get(baseUrl + '/artists/' + encodeURIComponent(artistid), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got artist', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getArtistAlbums: function(artistid, country) {
				var ret = $q.defer();
				$http.get(baseUrl + '/artists/' + encodeURIComponent(artistid) + '/albums?country=' + encodeURIComponent(country), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got artist albums', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getArtistTopTracks: function(artistid, country) {
				var ret = $q.defer();
				$http.get(baseUrl + '/artists/' + encodeURIComponent(artistid) + '/top-tracks?country=' + encodeURIComponent(country), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got artist top tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getSearchResults: function(query) {
				var ret = $q.defer();
				$http.get(baseUrl + '/search?type=track,playlist&q=' + encodeURIComponent(query) + '&market=from_token', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got search results', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			findShows: function(query) {
				var ret = $q.defer();
				$http.get(baseUrl + '/search?type=show&q=' + encodeURIComponent(query) + '&market=from_token', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got search results for shows', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			findEpisodes: function(query) {
				var ret = $q.defer();
				$http.get(baseUrl + '/search?type=episode&q=' + encodeURIComponent(query) + '&market=from_token', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got search results for episodes', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getNewReleases: function(country) {
				var ret = $q.defer();
				$http.get(baseUrl + '/browse/new-releases?country=' + encodeURIComponent(country), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got new releases results', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getFeaturedPlaylists: function(country, timestamp) {
				var ret = $q.defer();
				$http.get(baseUrl + '/browse/featured-playlists?country=' +
					encodeURIComponent(country) +
					'&timestamp=' + encodeURIComponent(timestamp), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got featured playlists results', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getUser: function(username) {
				var ret = $q.defer();
				$http.get(baseUrl + '/users/' +
					encodeURIComponent(username),
				{
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got userinfo', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to get userinfo', err);
					ret.reject(err);
				});
				return ret.promise;
			},

			isFollowing: function(id, type) {
				var ret = $q.defer();
				$http.get(baseUrl + '/me/following/contains?' +
					'type=' + encodeURIComponent(type) +
					'&ids=' + encodeURIComponent(id),
				{
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got following', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to get following', err);
					ret.reject(err);
				});

				return ret.promise;
			},

			follow: function(id, type) {
				var ret = $q.defer();
				$http.put(baseUrl + '/me/following?' +
					'type=' + encodeURIComponent(type),
				{ ids : [ id ] },
				{ headers: { 'Authorization': 'Bearer ' + Auth.getAccessToken() }
				}).success(function(r) {
					console.log('followed', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to follow', err);
					ret.reject(err);
				});

				return ret.promise;
			},

			unfollow: function(id, type) {
				var ret = $q.defer();
				$http.delete(baseUrl + '/me/following?' +
					'type=' + encodeURIComponent(type),
				{ data: {
						ids: [ id ]
				},
				headers: {
					'Authorization': 'Bearer ' + Auth.getAccessToken()
				}
				}).success(function(r) {
					console.log('unfollowed', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to unfollow', err);
					ret.reject(err);
				});

				return ret.promise;
			},

			followPlaylist: function(username, playlist) {
				var ret = $q.defer();
				$http.put(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists/' +
					encodeURIComponent(playlist) + '/followers',
				{},
				{ headers: { 'Authorization': 'Bearer ' + Auth.getAccessToken() }
				}).success(function(r) {
					console.log('followed playlist', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to follow playlist', err);
					ret.reject(err);
				});

				return ret.promise;
			},

			unfollowPlaylist: function(username, playlist) {
				var ret = $q.defer();
				$http.delete(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists/' +
					encodeURIComponent(playlist) + '/followers',
				{ headers: { 'Authorization': 'Bearer ' + Auth.getAccessToken() }
				}).success(function(r) {
					console.log('unfollowed playlist', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to unfollow playlist', err);
					ret.reject(err);
				});

				return ret.promise;
			},

			isFollowingPlaylist: function(username, playlist) {
				var ret = $q.defer();
				$http.get(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists/' +
					encodeURIComponent(playlist) + '/followers/contains', {
						params: {
							ids: [Auth.getUsername()]
						},
						headers: { 'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('check if playlist is followed', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to check if playlist is followed', err);
					ret.reject(err);
				});

				return ret.promise;
			},

			getBrowseCategories: function() {
				var ret = $q.defer();
				$http.get(baseUrl + '/browse/categories', {
					headers: { 'Authorization': 'Bearer ' + Auth.getAccessToken() }
				}).success(function(r) {
					console.log('got browse categories', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to get browse categories', err);
					ret.reject(err);
				});
				return ret.promise;
			},

			getBrowseCategory: function(categoryId) {
				var ret = $q.defer();
				$http.get(baseUrl + '/browse/categories/' + categoryId, {
					headers: { 'Authorization': 'Bearer ' + Auth.getAccessToken() }
				}).success(function(r) {
					console.log('got browse category', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to get browse category', err);
					ret.reject(err);
				});
				return ret.promise;
			},

			getBrowseCategoryPlaylists: function(categoryId, country) {
				var ret = $q.defer();
				$http.get(baseUrl + '/browse/categories/' + categoryId + '/playlists?country=' + encodeURIComponent(country), {
					headers: { 'Authorization': 'Bearer ' + Auth.getAccessToken() }
				}).success(function(r) {
					console.log('got browse category playlists', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to get category playlists', err);
					ret.reject(err);
				});
				return ret.promise;
			},

		};
	});

})();

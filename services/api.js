(function() {

	var module = angular.module('PlayerApp');

	module.factory('API', function(Auth, $q, $http) {

		var baseUrl = 'https://api.spotify.com/v1';

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
				var ret = $q.defer();
				$http.get(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists', {
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
				$http.get(baseUrl + '/search?type=track&q=' + encodeURIComponent(query), {
				}).success(function(r) {
					console.log('got search results', r);
					ret.resolve(r);
				});
				return ret.promise;
			}
		}
	});

})();

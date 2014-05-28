(function() {

	var module = angular.module('PlayerApp');

	module.factory('API', function(Auth, $q, $http) {
		return {

			getMyUsername: function() {
				var ret = $q.defer();
				$http.get('https://api.spotify.com/v1/me', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got userinfo', r);
					ret.resolve(r.id);
				});
				return ret.promise;
			},

			getPlaylists: function(username) {
				var ret = $q.defer();
				$http.get('https://api.spotify.com/v1/users/' + username + '/playlists', {
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
				$http.get('https://api.spotify.com/v1/users/' + username + '/playlists/' + playlist, {
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
				$http.get('https://api.spotify.com/v1/users/' + username + '/playlists/' + playlist + '/tracks', {
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
				$http.get('https://api.spotify.com/v1/tracks/' + trackid, {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got track', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getAlbum: function(albumid) {
				var ret = $q.defer();
				$http.get('https://api.spotify.com/v1/albums/' + albumid, {
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
				$http.get('https://api.spotify.com/v1/albums/' + albumid + '/tracks', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got album tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			}

		}
	});

})();

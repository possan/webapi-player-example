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
					console.log('got userinfo',r);
					ret.resolve(r.id);
				});
				return ret.promise;
			},

			getPlaylists: function() {
				var ret = $q.defer();
				$http.get('https://api.spotify.com/v1/users/' + Auth.getUsername() + '/playlists', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got playlists',r);
					ret.resolve(r);
				});
				return ret.promise;
			}

		}
	});

})();

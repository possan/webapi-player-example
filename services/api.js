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
					console.log('got',r);
					ret.resolve(r.id);
				});
				return ret.promise;
			},
		}
	});

})();

(function() {

	var module = angular.module('PlayerApp');

	module.factory('Auth', function() {

		var CLIENT_ID = '';
		var REDIRECT_URI = '';

		if (location.host == 'localhost:8000') {
			CLIENT_ID =	'409f070cb44945d9a85e9b4ad8fa3bf1';
			REDIRECT_URI = 'http://localhost:8000/callback.html';
		} else {
			CLIENT_ID = '9714921402b84783b2a207f1b6e82612';
			REDIRECT_URI = 'http://lab.possan.se/thirtify/callback.html';
		}

		function getLoginURL(scopes) {
			return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID
				+ '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
				+ '&scope=' + encodeURIComponent(scopes.join(' '))
				+ '&response_type=token';
		}

		return {
			openLogin: function() {
				var url = getLoginURL(['playlist-read-private','user-read-private','playlist-read'])
				var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
				// window.location = url;
			},
			getAccessToken: function() {
				var expires = 0 + localStorage.getItem('pa_expires', '0');
				if ((new Date()).getTime() > expires) {
					return '';
				}
				var token = localStorage.getItem('pa_token', '');
				return token;
			},
			setAccessToken: function(token, expires_in) {
				localStorage.setItem('pa_token', token);
				localStorage.setItem('pa_expires', (new Date()).getTime() + expires_in);
				// _token = token;
				// _expires = expires_in;
			},
			getUsername: function() {
				var username = localStorage.getItem('pa_username', '');
				return username;
			},
			setUsername: function(username) {
				localStorage.setItem('pa_username', username);
			}
		}
	});

})();

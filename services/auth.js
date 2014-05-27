(function() {

	var module = angular.module('PlayerApp');

	module.factory('Auth', function() {

		var CLIENT_ID = '2e7b7dc36e1a424a84368e5cc74201ae';
		// var client_secret = 'c60c8b5931894a94afd60a46a5bd2e4a';
		var REDIRECT_URI = 'http://localhost:8000';

		function getLoginURL(scopes) {
			return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID
				+ '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
				+ '&scope=' + encodeURIComponent(scopes.join(' '))
				+ '&response_type=token';
		}

		return {
			openLogin: function() {
				var url = getLoginURL(['playlist-read-private','user-read-private','playlist-read'])
				// var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
				window.location = url;
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

(function() {

	var module = angular.module('PlayerApp');

	module.factory('Auth', function() {

		var CLIENT_ID = '';
		var REDIRECT_URI = '';

		if (location.host == 'localhost:8000') {
			CLIENT_ID =	'9cae232f0ddd4ba3b55b7e54ca6e76f0';
			REDIRECT_URI = 'http://localhost:8000/callback.html';
		} else {
		}

		function getLoginURL(scopes) {
			return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID
				+ '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
				+ '&scope=' + encodeURIComponent(scopes.join(' '))
				+ '&response_type=token';
		}

		return {
			openLogin: function() {
				var url = getLoginURL([
					'user-read-private',
					'playlist-read-private',
					'playlist-modify-public',
					'playlist-modify-private',
					'user-library-read',
					'user-library-modify',
					'user-follow-read',
					'user-follow-modify',
					"streaming", 
					"user-read-birthdate", 
					"user-read-email", 
					"user-read-private"
				]);

				var width = 450,
						height = 730,
						left = (screen.width / 2) - (width / 2),
						top = (screen.height / 2) - (height / 2);

				var w = window.open(url,
						'Spotify',
						'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
				);
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
			},
			getUserCountry: function() {
				var userCountry = localStorage.getItem('pa_usercountry', 'US');
				return userCountry;
			},
			setUserCountry: function(userCountry) {
				localStorage.setItem('pa_usercountry', userCountry);
			}
		}
	});

})();

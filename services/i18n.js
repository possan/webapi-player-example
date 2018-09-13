(function() {
	
	var module = angular.module('PlayerApp');

	module.factory('I18n', async function($q, $http) {
		let locale = navigator.language

		let lang = await fetch(
			'/locale/' + locale + '.json'
		).then(r => r.json())
		let i18n = {
			t: function (input) {
				let translatedString = lang[input]
				if (!translatedString) {
					translatedString = input
				}

				let args = arguments.slice(1)
				for (let i = 0; i < args.length; i++) {
					translatedString = translatedString.replace('%' + i, args[i])
				}
				return translatedString
			}
		}
	})
	
})
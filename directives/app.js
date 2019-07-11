(function() {

	var module = angular.module('PlayerApp');
	module.directive('spotifyApp', function(Auth, $location) {
		return {
			restrict: 'E',
			scope: {
				bundle: '@bundle',
				parameters: '@parameters'
			},
			replace: false,
			compile: function (tElem, tAttrs) {
				var linkFunction = function($scope,  element, attributes) {
					element.html(
						'<iframe frameborder="0" style="width: 100%; height: 100%"></iframe>'
					)
					let iframe = element[0].querySelector('iframe')
					iframe.src = 'http://' + attributes.bundle + '.buddhalow.net'
				
					iframe.addEventListener('load', function () {
						console.log(attributes.parameters)
						iframe.contentWindow.postMessage({
							'action': 'parameters',
							'parameters': attributes.parameters.split(/\:/),
							'access_token': Auth.getAccessToken(),
						}, '*')
					})
					window.addEventListener('message', function (event) {
						if (event.data.action === 'navigate') {
							let uri = event.data.uri
							let parts = uri.split(/\:/)
							let bundle = parts[2]
							let parameters = parts.splice(3)
							if (bundle == attributes.bundle) {
								if (uri.indexOf('spotify:app:' + attributes.bundle) === 0) {
									iframe.contentWindow.postMessage({
										'action': 'parameters',
										'parameters': parameters,
										'access_token': Auth.getAccessToken(),
									}, '*')
									$location.path('/app/' + attributes.bundle + '/' + parameters.join('/')).reload(false)
								} else {

									$location.path('/' + parts.slice(1).join('/'))
								}

							}
						}
					})
				};
				return linkFunction;
			}
		};
	});

})();

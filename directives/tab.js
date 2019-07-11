(function() {
	var module = angular.module('PlayerApp');
	module.directive('tabbarTab', function($location) {
		return {
			restrict: 'E',
			scope: {
				section: '=section',
				label: '@'
			},
			compile: function (element, attributes) {
			  	
				//linkFunction is linked with each element with scope to get the element specific data.
				var linkFunction = function($scope, element, attributes) {
					var hash = window.location.hash.substr(1)
					if (!hash || hash.length < 1) {
						hash = 'overview'
					}
					element.html(attributes.label)

					if (attributes.section == hash) {
						element.addClass('active')
					}
				 	element.mousedown(function () {
						console.log(attributes.section)
			      		window.location.href = window.location.href.split('#')[0] + '#' + attributes.section
			      	})
				}
				return linkFunction;
			   
			}
		};
	});
})();

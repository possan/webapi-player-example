(function() {
	var module = angular.module('PlayerApp');
	module.directive('tabContent', function($location) {
		return {
			restrict: 'A',
			scope: {
				section: '=section',
			},
			compile: function (element, attributes) {
				//linkFunction is linked with each element with scope to get the element specific data.
				var linkFunction = function($scope, element, attributes) {
					let hash = window.location.hash.substr(1)
					if (!hash || hash.length < 1) {
						hash = 'overview'
					}
					if (attributes.section == hash) {
						element.show()
					} else {
						element.hide()
					}
				}
				return linkFunction;
			   
			}
		};
	});
})();

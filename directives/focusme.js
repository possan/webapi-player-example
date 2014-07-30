(function() {
	var module = angular.module('PlayerApp');
	module.directive('focusMe', function($timeout) {
		return {
			link: function(scope, element, attrs) {
				scope.$watch(attrs.focusMe, function(value) {
					if(value === true) {
						console.log('value=',value);
						$timeout(function() {
							element[0].focus();
							element[0].select();
							scope[attrs.focusMe] = false;
						});
					}
				});
			}
		};
	});
})();

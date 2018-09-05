(function() {

	var module = angular.module('PlayerApp');

	module.directive('genericHeader', function() {
		return {
			restrict: 'E',
			scope: {
				data: '=ngModel'
			},
			templateUrl: '/partials/generic_header.html'
		};
	});
})();
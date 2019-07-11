(function() {

	var module = angular.module('PlayerApp');

	module.directive('genericHeader', function() {
		return {
			restrict: 'E',
			scope: {
				data: '=ngModel',
				isFollowable: '=followable',
				isPlayable: '=playable'
			},
			templateUrl: '/partials/generic_header.html'
		};
	});
})();
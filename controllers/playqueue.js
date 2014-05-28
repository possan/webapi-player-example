(function() {

	var module = angular.module('PlayerApp');

	module.controller('PlayQueueController', function($scope, $rootScope, $routeParams, PlayQueue) {

		function refresh() {
			$scope.current = PlayQueue.getCurrent();
			$scope.position = PlayQueue.getPosition();
			$scope.queue = PlayQueue.getQueue();
		}

		$rootScope.$on('playqueuechanged', function() {
			refresh();
		});

		refresh();
	});

})();

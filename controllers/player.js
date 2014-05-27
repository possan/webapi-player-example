(function() {

	var module = angular.module('PlayerApp');

	module.controller('PlayerController', function($scope, Auth, PlayQueue) {
		$scope.view = 'welcome';
		$scope.username = Auth.getUsername();

		$scope.logout = function() {
			// do login!
			console.log('do logout...');
			$scope.$emit('logout');
		}

		$scope.play = function(trackuri) {
			PlayQueue.play(trackuri);
		}

		$scope.queue = function(trackuri) {
			PlayQueue.enqueue(trackuri);
		}

		$scope.$on('login', function() {
			$scope.username = Auth.getUsername();
		});

		$scope.$on('playqueuechanged', function() {
			console.log('PlayerController: play queue changed.');
		});

		$scope.$on('playerchanged', function() {
			console.log('PlayerController: player changed.');
		});
	});

})();

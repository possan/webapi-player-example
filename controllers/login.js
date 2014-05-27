(function() {

	var module = angular.module('PlayerApp');

	module.controller('LoginController', function($scope, Auth) {
		$scope.isLoggedIn = false;

		$scope.login = function() {
			// do login!
			console.log('do login...');

			Auth.openLogin();
			// $scope.$emit('login');
		}
	});

})();

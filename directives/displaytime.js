(function() {

	var module = angular.module('PlayerApp');

	module.directive('displaytime', function() {
		return {
			restrict: 'E',
			replace: 'true',
			scope: {},
			template: '<span>{{displaytime}}</span>',
			link: function(scope, element, attrs) {

				function twodigit(n) {
					if (n < 10) {
						return '0' + n;
					} else {
						return n;
					}
				}

				function updateDisplay(input) {
					if (input) {
						var secs = Math.round((0 + input) / 1000);
						var mins = Math.floor(secs / 60);
						secs -= mins * 60;
						var hours = Math.floor(mins / 60);
						mins -= hours * 60;
						if (hours > 0) {
							scope.displaytime = hours + ':' + twodigit(mins) + ':' + twodigit(secs);
						}
						else {
							scope.displaytime = mins + ':' + twodigit(secs);
						}
					} else {
						scope.displaytime = '';
					}
				}

				scope.$parent.$watch(attrs.time, function(newvalue) {
					updateDisplay(0 + newvalue);
				});

				setTimeout(function() {
					updateDisplay(0 + scope.$parent.$eval(attrs.time));
				}, 100);
			}
		};
	});

})();

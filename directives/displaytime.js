(function() {

	var module = angular.module('PlayerApp');

	module.directive('displaytime', function() {
		return {
			restrict: 'E',
			replace: 'true',
			scope: {
				// time: '@time'
			},
			template: '<span>{{displaytime}}</span>',
			link: function(scope, element, attrs) {
				console.log('displaytime', scope, element, attrs);

				function twodigit(n) {
					if (n < 10) {
						return '0' + n;
					} else {
						return n;
					}
				}

				function updateDisplay(input) {
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
					scope.$apply();
				}

				scope.$parent.$watch(attrs.time, function(newvalue) {
					console.log('displaytime time changed', newvalue);
					updateDisplay(newvalue);
				});

				setTimeout(function() {
					updateDisplay(0 + scope.$parent.$eval(attrs.time));
				}, 100);
			}
		};
	});

})();

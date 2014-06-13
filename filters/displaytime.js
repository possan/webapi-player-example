(function() {

	var module = angular.module('PlayerApp');

	module.filter('displaytime', function() {
		return function(input) {
			function twodigit(n) {
				if (n < 10) {
					return '0' + n;
				} else {
					return n;
				}
			}

			function format(input) {
				if (input) {
					var secs = Math.round((0 + input) / 1000);
					var mins = Math.floor(secs / 60);
					secs -= mins * 60;
					var hours = Math.floor(mins / 60);
					mins -= hours * 60;
					if (hours > 0) {
						return hours + ':' + twodigit(mins) + ':' + twodigit(secs);
					}
					else {
						return mins + ':' + twodigit(secs);
					}
				} else {
					return '';
				}
			}

			return format(input);
		};
	});

})();

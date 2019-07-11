(function() {
	
	var module = angular.module('PlayerApp');
	module.filter('i18n', function(I18n) {
	  return function(input) {
	    return I18n.t(input, arguments.slice(1))
	  };
	})
})
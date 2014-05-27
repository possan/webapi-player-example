(function() {

	var module = angular.module('PlayerApp');

	module.factory('Playback', function($rootScope) {
		return {
			startPlaying: function(trackuri) {
				console.log('Playback::startPlaying', trackuri);
				$rootScope.$emit('playerchanged');
			}
		}
	});

})();

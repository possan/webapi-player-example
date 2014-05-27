(function() {

	var module = angular.module('PlayerApp');

	module.factory('PlayQueue', function(Playback, $rootScope) {
		return {
			play: function(trackuri) {
				console.log('Clear queue and play track', trackuri);
				$rootScope.$emit('playqueuechanged');
			},
			enqueue: function(trackuri) {
				console.log('Enqueue track', trackuri);
				$rootScope.$emit('playqueuechanged');
			}
		}
	});

})();

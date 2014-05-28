(function() {

	var module = angular.module('PlayerApp');

	module.factory('PlayQueue', function(Playback, $rootScope) {
		var _queue = [];
		var _position = 0;
		return {
			play: function(trackuri) {
				console.log('Clear queue and play track', trackuri);
				_queue = [];
				_queue.push(trackuri);
				_position = 0;
				$rootScope.$emit('playqueuechanged');
				Playback.startPlaying(trackuri);
			},
			enqueue: function(trackuri) {
				console.log('Enqueue track', trackuri);
				_queue.push(trackuri);
				$rootScope.$emit('playqueuechanged');
			},
			enqueueList: function(trackuris) {
				console.log('Enqueue tracks', trackuris);
				trackuris.forEach(function(trackuri) {
					_queue.push(trackuri);
				});
				$rootScope.$emit('playqueuechanged');
			},
			playFrom: function(index) {
				_position = index;
				$rootScope.$emit('playqueuechanged');
				Playback.startPlaying(_queue[_position]);
			},
			getQueue: function() {
				return _queue;
			},
			getPosition: function() {
				return _position;
			},
			getCurrent: function() {
				if (_queue.length > 0) {
					return _queue[_position];
				}
				return '';
			},
			clear: function() {
				_queue = [];
				_position = 0;
				$rootScope.$emit('playqueuechanged');
			},
			next: function() {
				console.log('PlayQueue: next');
				_position ++;
				if (_position >= _queue.length) {
					// TODO: if repeat is on.
					_position = 0;
				}
				$rootScope.$emit('playqueuechanged');
			},
			prev: function() {
				console.log('PlayQueue: prev');
				_position --;
				if (_position < 0) {
					// TODO: if repeat is on.
					_position =  _queue.length - 1;
				}
				$rootScope.$emit('playqueuechanged');
			}
		}
	});

})();

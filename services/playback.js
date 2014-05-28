(function() {

	var module = angular.module('PlayerApp');

	module.factory('Playback', function($rootScope) {
		var _playing = false;
		var _track = '';
		var _volume = 100;
		var _progress = 0;

		function tick() {
			if (!_playing) {
				return;
			}
			_progress += 100;
			$rootScope.$emit('trackprogress');
			if (_progress >= 4000) {
				console.log('track stopped. end track', _track);
				_playing = false;
				_track = '';
				// $rootScope.$emit('playerchanged');
				disableTick();
				$rootScope.$emit('endtrack');
			}
		}

		var ticktimer = 0;

		function enableTick() {
			disableTick();
			ticktimer = setInterval(tick, 100);
		}

		function disableTick() {
			if (ticktimer != 0) {
				clearInterval(ticktimer);
			}
		}

		return {
			getVolume: function() {
				return _volume;
			},
			setVolume: function(v) {
				_volume = v;
			},
			startPlaying: function(trackuri) {
				console.log('Playback::startPlaying', trackuri);

				_track = trackuri;
				_playing = true;
				_progress = 0;
				$rootScope.$emit('playerchanged');
				$rootScope.$emit('trackprogress');
				enableTick();
			},
			stopPlaying: function() {
				_playing = false;
				_track = '';
				$rootScope.$emit('playerchanged');
			},
			pause: function() {
				if (_track != '') {
					_playing = false;
					$rootScope.$emit('playerchanged');
					disableTick();
				}
			},
			resume: function() {
				if (_track != '') {
					_playing = true;
					$rootScope.$emit('playerchanged');
					enableTick();
				}
			},
			isPlaying: function() {
				return _playing;
			},
			getTrack: function() {
				return _track;
			},
			getProgress: function() {
				return _progress;
			}
		}
	});

})();

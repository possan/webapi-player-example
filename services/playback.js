(function() {

	var module = angular.module('PlayerApp');

	module.factory('Playback', function($rootScope, API, $interval) {
		

		var _playing = false;
		var _track = '';
		var _volume = 100;
		var _progress = 0;
		var _duration = 0;
		var _trackdata = null;

		function tick() {
			if (!_playing) {
				return;
			}
			_progress = audiotag.currentTime * 1000.0;

			$rootScope.$emit('trackprogress');
			/*
			if (_progress >= 4000) {
				console.log('track stopped. end track', _track);
				_playing = false;
				_track = '';
				// $rootScope.$emit('playerchanged');
				disableTick();
				$rootScope.$emit('endtrack');
			}*/
		}

		var ticktimer = 0;

		function enableTick() {
			disableTick();
			ticktimer = $interval(tick, 100);
		}

		function disableTick() {
			if (ticktimer != 0) {
				$interval.cancel(ticktimer);
			}
		}

		var audiotag = new Audio();

	

		return {

			getVolume: function() {
				return _volume;
			},
			setVolume: function(v) {
				_volume = v;
				audiotag.volume = _volume / 100.0;
			},
			startPlaying: function(trackuri) {
				console.log('Playback::startPlaying', trackuri);
				_track = trackuri;
				_trackdata = null;
				_playing = true;
				_progress = 0;
				var trackid = trackuri.split(':')[2];

				API.playTracks([trackuri]).then(function(trackdata) {
					console.log('playback got track', trackdata);

					_trackdata = trackdata;
					_progress = 0;
					$rootScope.$emit('playerchanged');
					$rootScope.$emit('trackprogress');
					enableTick();
					
				});
			},
			stopPlaying: function() {
				_playing = false;
				_track = '';
				API.stopPlayback().then(function () {});
				_trackdata = null;
				$rootScope.$emit('playerchanged');
			},
			pause: function() {
				API.pausePlayback().then(function () {});
				_playing = false;
				$rootScope.$emit('playerchanged');
			},
			resume: function() {
				API.resumePlayback().then(function () {});
				_playing = true;
				$rootScope.$emit('playerchanged');
			},
			isPlaying: function() {
				return _playing;
			},
			getTrack: function() {
				return _track;
			},
			getTrackData: function() {
				return _trackdata;
			},
			getProgress: function() {
				return _progress;
			},
			setProgress: function(pos) {
				API.seekPlayback(pos).then(function () {})
			},
			getDuration: function() {
				return _duration;
			}
		}
	});

})();

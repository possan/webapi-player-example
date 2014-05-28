(function() {

	var module = angular.module('PlayerApp');

	module.factory('Playback', function($rootScope, API) {
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
			ticktimer = setInterval(tick, 100);
		}

		function disableTick() {
			if (ticktimer != 0) {
				clearInterval(ticktimer);
			}
		}

		var audiotag = null;

		function createAndPlayAudio(url, callback, endcallback) {
			console.log('createAndPlayAudio', url);
			if (audiotag != null) {
				audiotag.pause();
				delete(audiotag);
				audiotag = null;
			}
			audiotag = new Audio(url);
			audiotag.addEventListener('loadedmetadata', function() {
				console.log('audiotag loadedmetadata');
				_duration = audiotag.duration * 1000.0;
				audiotag.play();
				callback();
			}, false);
			audiotag.addEventListener('ended', function() {
				console.log('audiotag ended');
				_playing = false;
				_track = '';
				disableTick();
				$rootScope.$emit('endtrack');
				audiotag = null;
			}, false);
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
				_trackdata = null;
				_playing = true;
				_progress = 0;
				var trackid = trackuri.split(':')[2];
				API.getTrack(trackid).then(function(trackdata) {
					console.log('playback got track', trackdata);
					createAndPlayAudio(trackdata.preview_url, function() {
						_trackdata = trackdata;
						_progress = 0;
						$rootScope.$emit('playerchanged');
						$rootScope.$emit('trackprogress');
						enableTick();
					});
				});
			},
			stopPlaying: function() {
				_playing = false;
				_track = '';
				audiotag.stop();
				_trackdata = null;
				$rootScope.$emit('playerchanged');
			},
			pause: function() {
				if (_track != '') {
					_playing = false;
					audiotag.pause();
					$rootScope.$emit('playerchanged');
					disableTick();
				}
			},
			resume: function() {
				if (_track != '') {
					_playing = true;
					audiotag.play();
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
			getTrackData: function() {
				return _trackdata;
			},
			getProgress: function() {
				return _progress;
			},
			setProgress: function(pos) {
				audiotag.currentTime = pos / 1000.0;
			},
			getDuration: function() {
				return _duration;
			}
		}
	});

})();

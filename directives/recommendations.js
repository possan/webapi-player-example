(function() {

	var module = angular.module('PlayerApp');

	module.directive('recommendedTracks', function(API) {
		return {
			restrict: 'E',
			scope: {
				artists: '@artists',
				genres: '@genres',
				tracks: '@tracks',
				market: '@market',
				limit: '@limit'
			},
			compile: function (tElem, tAttrs) {
				var linkFunction = function($scope, element, attributes) {
					API.getRecommendations({
						seed_artists: attributes.artists,
						seed_genres: attributes.genres,
						seed_tracks: attributes.tracks
					}).then(function (results) {
						$scope.recommendedTracks = results.tracks

					})
				};
				return linkFunction;
			},
			templateUrl: '/partials/recommendations.html'
		};
	});
})();
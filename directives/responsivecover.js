(function() {

	var module = angular.module('PlayerApp');

	module.directive('responsiveCover', function() {
		return {
			restrict: 'E',
			scope: {
				imagesData: '=ngModel'
			},
			replace: true,
			compile: function (tElem, tAttrs) {
				var linkFunction = function($scope, element, attributes) {
					var elem = element[0];

					var interval = null;
					$scope.$watch('imagesData', function() {
						if (interval) {
							clearInterval(interval);
							interval = null;
						}

						if ($scope.imagesData) {
							try {
								var images = $scope.imagesData;
								if (!images.length) { return; }

								// todo: once we have loaded a large one maybe it doesn't make sense to try to load
								// a smaller one, since that incurs in an extra request and the quality won't be
								// better than the one provided by the larger image

								var findRightImage = function() {
									var targetWidth = elem.offsetWidth * window.devicePixelRatio,
									targetHeight = elem.offsetHeight * window.devicePixelRatio;

									if (targetWidth === 0 || targetHeight === 0) {
										return;
									}

									var cover = images[0].url;
									for (var i=1; i<images.length; i++) {
										if (images[i].width >= targetWidth && images[i].height >= targetHeight) {
											cover = images[i].url;
										}
									}

									elem.style.backgroundImage = 'url(' + cover + ')';

								}.bind(this);
								interval = setInterval(findRightImage, 200);
								findRightImage();
							} catch (e) {
								console.error(e);
							}
						}
					});
				};
				return linkFunction;
			}
		};
	});

})();

(function() {

	var module = angular.module('PlayerApp');

	module.directive('playlistCover', function() {
		return {
			restrict: 'E',
			scope: {
				playlistData: '=ngModel'
			},
			replace: false,
			compile: function (tElem, tAttrs) {
				var linkFunction = function($scope, element, attributes) {
					$scope.$watch('playlistData', function() {
						if ($scope.playlistData) {
							if ($scope.playlistData.images.length && $scope.playlistData.images[0]) {
								tElem.append('<div class="cover" style="background-image:url(' + $scope.playlistData.images[0].url + ')"></div>');
							} else {

								var selectedAlbums = [],
									selectedImages = [];

								var multiple = false;
								if ($scope.playlistData.tracks.items.length >= 4) {
									$scope.playlistData.tracks.items.some(function(t) {
										if (selectedAlbums.indexOf(t.track.album.id) === -1) {
											selectedAlbums.push(t.track.album.id);
											selectedImages.push(t.track.album.images[0].url);
											if (selectedAlbums.length === 4) {
												return true;
											}
										}
										return false;
									});
									if (selectedAlbums.length === 4) {
										multiple = true;
									}
								}

								if (multiple) {
									selectedImages.forEach(function(selectedImage) {
										tElem.append('<div class="cover-component" style="background-image:url(' + selectedImage + ')"></div>');
									});
								} else {
									if ($scope.playlistData.tracks.items.length) {
										var images = $scope.playlistData.tracks.items[0].track.album.images;
										tElem.append('<div class="cover" style="background-image:url(' + images[0].url + ')"></div>');
									}
								}
							}
						}
					});
				};
				return linkFunction;
			}
		};
	});

})();

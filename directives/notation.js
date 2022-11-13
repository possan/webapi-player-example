(function() {

	var module = angular.module('PlayerApp');

	module.directive('VexTab', function() {
		return {
			restrict: 'E',
			scope: {
				data: '=ngModel'
			},
			replace: false,
			compile: function (tElem, tAttrs) {
				var linkFunction = function($scope, element, attributes) {
					$scope.$watch('data', function() {
						VF = Vex.Flow;

						// Create an SVG renderer and attach it to the DIV element named "boo".
						var div = document.getElementById("boo")
						var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

						// Size our svg:
						renderer.resize(500, 500);

						// And get a drawing context:
						var context = renderer.getContext();
						// Create a stave at position 10, 40 of width 400 on the canvas.

						var stave = new VF.Stave(10, 40, 400);

						// Add a clef and time signature.
						

						// Connect it to the rendering context and draw!
						stave.setContext(context).draw();
						$scope.data.sections.map((section) => {
							stave.addClef("treble").addTimeSignature(section.time_signature + '/' + section.time_signature);
						})
					});
				};
				return linkFunction;
			}
		};
	});

})();

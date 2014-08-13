(function() {

	var module = angular.module('PlayerApp');
	module.directive('ngContextMenu', function ($parse) {
			var renderContextMenu = function ($scope, event, options) {
					if (!$) { var $ = angular.element; }
					$(event.target).addClass('context');
					var $contextMenu = $('<div>');
					var $list = $('<div>');
					$list.addClass('context-menu');
					$list.attr({ 'role': 'menu' });
					$list.css({
							display: 'block',
							position: 'absolute',
							left: event.pageX + 'px',
							top: event.pageY + 'px'
					});
					angular.forEach(options, function (item, i) {
							var $item = $('<div>');
							if (item === null) {
									$item.addClass('divider');
							} else {
									$item.addClass('item');
									$a = $('<a>');
									$a.attr({ tabindex: '-1', href: '#' });
									$a.text(item[0]);
									$item.append($a);
									$item.on('click', function () {
											$scope.$apply(function() {
													item[1].call($scope, $scope);
											});
									});
							}
							$list.append($item);
					});
					$contextMenu.append($list);
					$contextMenu.css({
							width: '100%',
							height: '100%',
							position: 'absolute',
							top: 0,
							left: 0,
							zIndex: 9999
					});
					$(document).find('body').append($contextMenu);
					$contextMenu.on("click", function (e) {
							$(event.target).removeClass('context');
							$contextMenu.remove();
							e.preventDefault();
					}).on('contextmenu', function (event) {
							$(event.target).removeClass('context');
							event.preventDefault();
							$contextMenu.remove();
					});
			};
			return function ($scope, element, attrs) {
					element.on('contextmenu', function (event) {
							$scope.$apply(function () {
									event.preventDefault();
									var options = $scope.$eval(attrs.ngContextMenu);
									if (options === null) return;
									if (options instanceof Array) {
											renderContextMenu($scope, event, options);
									} else {
											throw '"' + attrs.ngContextMenu + '" not an array';
									}
							});
					});
			};
	});
})();

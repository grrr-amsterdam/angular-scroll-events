angular.module('grrrScroll')
.directive('infiniteScroll', function($log, $window, $document, $timeout, $route, Scroll) {
	'use strict';

	$window = angular.element($window);

	/**
	 * Get element's visual offset, relative to window.
	 */
	var getOffsetTop = function(element) {
		var body = $document[0].documentElement;
		var scrollX = $window[0].pageXOffset || body.scrollLeft;
		var scrollY = $window[0].pageYOffset || body.scrollTop;
		return { 
			left: element.getBoundingClientRect().left + scrollX, 
			top: element.getBoundingClientRect().top + scrollY
		};
	};
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var handler = scope.$eval(attrs.infiniteScroll),
				threshold = parseInt(attrs.scrollThreshold, 10) || 200,
				tid = null,
				height,
				offsetTop,
				doc = $document[0].documentElement,
				scrollPos = 0,
				// Ensure a unique id per infinite-scroll element
				scrollServiceId = 'infinite-scroll-' + element[0].className + element.attr('id');

			if (isNaN(threshold)) {
				$log.warn('Invalid threshold given');
				return;
			}

			if (!handler) {
				handler = function() {
					$log.log('Threshold reached');
				};
			}

			var scrollListener = function() {
				if (tid) {
					$timeout.cancel(tid);
				}
				tid = $timeout(function() {
					var bottom = offsetTop + height;
					var tmpScrollPos = ($window[0].pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
					var scrollingDown = (scrollPos - tmpScrollPos) < 0;
					if (scrollingDown && tmpScrollPos >= (bottom - threshold)) {
						handler();
						// Update the element's height
						$timeout(function() {
							height = element[0].offsetHeight;
						});
					}
					scrollPos = tmpScrollPos;
				}, 50);
			};

			var kickstart = function() {
				offsetTop = getOffsetTop(element[0]).top;
				height = element[0].offsetHeight;
				Scroll.attach(scrollServiceId, scrollListener);
			};

			// Detach when switching controllers
			var thisController = $route.current.controller;
			scope.$on("$routeChangeStart", function(e, current, prev) {
				if (current.controller !== thisController) {
					Scroll.detach(scrollServiceId, scrollListener);
				} else {
					kickstart();
				}
			});
			

			if (attrs.waitForEvent) {
				scope.$on(attrs.waitForEvent, function() {
					$timeout(function() {
						kickstart();
					});
				});
			} else {
				kickstart();
			}
		}
	};
});

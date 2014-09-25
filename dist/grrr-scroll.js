/**
 * Main module
 */
(function() {
	'use strict';
	angular.module('grrrScroll', []);
})();

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

/**
 * Save scroll position when navigating away and reapply when navigating back.
 * @author Harmen Janssen <harmen@grrr.nl>
 * @author Larix Kortbeek <larixk@gmail.com>
 */
angular.module('grrrScroll')
.directive('keepScroll', function($timeout, $window, $document) {
	'use strict';
	// Set scroll position
	function onLoad(id) {
		$timeout(function() {
			var scrollY = $window[id] ? $window[id] : 0;
			if (scrollY) {
				$timeout(function () {
					$window.scrollTo(0, scrollY);
				});
			}
		});
	}

	// Save scroll position in window
	function saveScrollTop(id) {
		$window[id] = ($window.pageYOffset || $document.documentElement.scrollTop) - 
			(document.documentElement.clientTop || 0);
	}
	return function(scope, element, attrs) {
		// Call after everything is rendered
		if (attrs.waitForEvent) {
			scope.$on(attrs.waitForEvent, function() {
				onLoad(attrs.keepScroll);
			});
		// Or immediately
		} else {
			onLoad(attrs.keepScroll);
		}

		// Call on navigating away
		scope.$on("$routeChangeStart", function() {
			saveScrollTop(attrs.keepScroll);
		});
	};
});

/**
 * Scroll service, listens to scroll events for you.
 * This ensures you only have a single scroll listener running at a given time.
 * Other modules can easily attach itself to it to respond to scroll events.
 */
angular.module('grrrScroll')
.factory('Scroll', function($window) {
	'use strict';
	$window = angular.element($window);
	var listeners = [],
		eventAttached = false,
		scrollListener = function() {
			// execute all callbacks on scroll event
			for (var i = 0, l = listeners.length; i < l; ++i) {
				listeners[i].callback();
			}
		},

		toggleListener = function() {
			if (listeners.length) {
				$window.on('scroll', scrollListener);
				eventAttached = true;
				return;
			}
			if (eventAttached) {
				$window.off('scroll', scrollListener);
				eventAttached = false;
			}
		},

		attached = function(id) {
			for (var i = 0, l = listeners.length; i < l; ++i) {
				if (listeners[i].id === id) {
					return true;
				}
			}
			return false;
		};

	return {
		attach: function(id, fn) {
			if (attached(id)) {
				return;
			}
			listeners.push({
				id: id,
				callback: fn
			});
			toggleListener();
		},
		detach: function(id) {
			var _tmpListeners = [];
			for (var i = 0, l = listeners.length; i < l; ++i) {
				if (listeners[i].id !== id) {
					_tmpListeners.push(listeners[i]);
				}
			}
			listeners = _tmpListeners;
			toggleListener();
		}
	};
});

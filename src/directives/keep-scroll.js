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
			var unsubscriber = scope.$on(attrs.waitForEvent, function() {
				onLoad(attrs.keepScroll);
				// Take care to respond to the event only once
				unsubscriber();
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

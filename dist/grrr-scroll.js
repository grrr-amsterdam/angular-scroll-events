/**
 * Main module
 */
'use strict';
angular.module('grrrScroll', []);

/**
 * Save scroll position when navigating away and reapply when navigating back.
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

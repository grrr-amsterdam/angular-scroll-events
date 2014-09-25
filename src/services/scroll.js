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

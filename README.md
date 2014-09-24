# Angular Scroll Events

A collection of Angular directives that act on various scroll events.

## Directives

### Keep-scroll

A directive for remembering scroll position between page views. 

Sometimes it makes sense to send a user back to the same scroll position when they come back to a
list page. Add the `keep-scroll` directive to elements where you want to remember the scroll
position. After navigating away from the page, the scroll position will be stored.

## How to use

Grab the minified distribution, link it in your project and make `grrrScroll` a dependency in your
project:

```
angular.module('myApp', ['grrrScroll']);
```

## To do

- Add tests
- Make into a bower package
- Add more directives

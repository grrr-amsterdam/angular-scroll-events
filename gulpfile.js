var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
 
gulp.task('default', function() {
	gulp.src(['src/**/module.js', 'src/**/*.js'])
		.pipe(concat('grrr-scroll.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/'));
});

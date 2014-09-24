var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
 
gulp.task('default', function() {
	// Full version
	gulp.src(['src/**/module.js', 'src/**/*.js'])
		.pipe(concat('grrr-scroll.js'))
		.pipe(gulp.dest('dist/'));
	gulp.src(['src/**/module.js', 'src/**/*.js'])
		.pipe(concat('grrr-scroll.min.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));
});

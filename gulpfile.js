var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
 
gulp.task('dist', function() {
	gulp.src(['src/**/module.js', 'src/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'))
		.pipe(concat('grrr-scroll.min.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));
});

gulp.task('default', function() {
	gulp.src(['src/**/module.js', 'src/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'))
		.pipe(concat('grrr-scroll.js'))
		.pipe(gulp.dest('dist/'));
});

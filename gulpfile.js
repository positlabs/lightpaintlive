var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var browserify = require('gulp-browserify');
var to5Browserify = require("6to5-browserify");

var paths = {
	dist: './dist/',
	templates: './src/templates/**/*.jade',
	entryStyle: './src/styles/main.scss',
	styles: './src/styles/**/*.scss',
	scripts: './src/scripts/**/*.js',
	entryScript: './src/scripts/main.js'
}

var templateTask = function(){
    return 	gulp.src(paths.templates)
			    .pipe(jade())
			    .pipe(gulp.dest(paths.dist));
}
gulp.task('build:templates', ['clean'], templateTask)
gulp.task('templates', templateTask);

var styleTask = function(){
    return 	gulp.src(paths.entryStyle)
		        .pipe(sass({
		        	errLogToConsole: true
		        }))
		        .pipe(gulp.dest(paths.dist));
}
gulp.task('build:styles', ['clean'], styleTask);
gulp.task('styles', styleTask);

var scriptTask = function(){
	return 	gulp.src(paths.entryScript)
				.pipe(browserify({
					debug: true,
					// transform: ['6to5-browserify']
				}))
				.pipe(gulp.dest(paths.dist))
}
gulp.task('build:scripts', ['clean'], scriptTask);
gulp.task('scripts', scriptTask);

gulp.task('build:move', ['clean'], function(){
	return 	gulp.src('./src/assets/**/*', {base:'./src/'})
				.pipe(gulp.dest(paths.dist));
});

gulp.task('watch', ['default'], function(){
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.templates, ['templates']);
	gulp.watch(paths.styles, ['styles']);
});

gulp.task('clean', function (cb) {
	return del([paths.dist], cb);
});

gulp.task('default', [

	'build:templates', 
	'build:styles', 
	'build:scripts', 
	'build:move'
	
], function(){});


var gulp = 			require('gulp');
var sass = 			require('gulp-sass');
var jade = 			require('gulp-jade');
var plumber = 		require('gulp-plumber');
var mergeStream = 	require('merge-stream');
var del = 			require('del');
var browserify = 	require('browserify');
var es6ify = 		require('es6ify');
var fs =	 		require('fs');
var path =	 		require('path');
var source = 		require('vinyl-source-stream');
var buffer = 		require('vinyl-buffer');
var colors = 		require('colors');
var bourbon = 		require('node-bourbon');
var uglify = 		require('gulp-uglify');
var gulpif = 		require('gulp-if');


var paths = {
	dist: 			'./dist/',
	templates: 		'./src/templates/**/*.jade',
	entryStyle: 	'./src/styles/main.scss',
	styles: 		'./src/styles/**/*.scss',
	scripts: 		'./src/scripts/**/*.js',
	entryScript: 	'./src/scripts/main.es6.js'
}



var templateTask = function(){
    return 	gulp.src(paths.templates)
		        .pipe(plumber())
			    .pipe(jade())
			    .pipe(gulp.dest(paths.dist));
}
gulp.task('build:templates', ['clean'], templateTask)
gulp.task('templates', templateTask);



var styleTask = function(){

    return 	gulp.src(paths.entryStyle)
		        .pipe(sass({
		        	errLogToConsole: true,
		        }))
		        .pipe(gulp.dest(paths.dist));
}
gulp.task('build:styles', ['clean'], styleTask);
gulp.task('styles', styleTask);



var scriptTask = function(debug){
	if(!fs.existsSync('./dist/')) fs.mkdirSync('./dist/');

	var out = 	browserify({
					debug: debug, // source maps
					modules: 'commonjs',
				})
				.add(es6ify.runtime)
				.require(require.resolve(paths.entryScript), { entry: true })
		 		.transform(es6ify.configure(/\.es6.*$/)) // explicit transforms on .es6.js files

				.bundle(function(err){
					if(err){
						console.log(err.message.bgBlack.magenta);	
						this.emit('end');
					}
				})

				.pipe(source('main.js'))

				.pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
			    .pipe(gulpif(!debug, uglify()))

				// .pipe(plumber())
				.pipe(gulp.dest(paths.dist))


	return out;
}
gulp.task('build:scripts:prod', ['clean'], function(){scriptTask(false)});
gulp.task('build:scripts', ['clean'], function(){scriptTask(true)});
gulp.task('scripts', function(){scriptTask(true)});



gulp.task('build:move', ['clean'], function(){
	var assets = 
		gulp.src('./src/assets/**/*', {base:'./src/'})
			.pipe(gulp.dest(paths.dist));

	var mercuryAlpha = 
		gulp.src('./archive/mercury/app/**/*', {base:'./archive/mercury/app/'})
			.pipe( gulp.dest(path.join(paths.dist, 'mercury/')) );
	
	var googleownership = 
		gulp.src('./archive/site/googleda3c10baf778c2f2.html', {base:'./archive/site/'})
			.pipe( gulp.dest(paths.dist) );

	return mergeStream(assets, mercuryAlpha, googleownership);
});



gulp.task('watch', ['default'], function(){
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.templates, ['templates']);
	gulp.watch(paths.styles, ['styles']);
});



gulp.task('clean', function (cb) {
	return del([paths.dist], cb);
});


gulp.task('build:prod', [

	'build:templates', 
	'build:styles', 
	'build:scripts:prod', 
	'build:move'

], function(){});



gulp.task('build:dev', [

	'build:templates', 
	'build:styles', 
	'build:scripts', 
	'build:move'
	
], function(){});

gulp.task('default', ['build:dev'], function(){});


// GULP PACKAGES
// Most packages are lazy loaded
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    filter = require('gulp-filter'),
    print = require('gulp-print').default,
    plugin = require('gulp-load-plugins')();


// GULP VARIABLES
// Modify these variables to match your project needs

// Select Foundation components, remove components project will not use
const SOURCE = {
	scripts: [
		// Place custom JS here, files will be concantonated, minified if ran with --production
		'src/scripts/**/*.js',
  ],

	// Scss files will be concantonated, minified if ran with --production
	styles: 'src/styles/**/*.scss',
};

const ASSETS = {
	styles: 'dist/styles/',
	scripts: 'dist/scripts/',
	all: 'dist/'
};

// GULP FUNCTIONS
// JSHint, concat, and minify JavaScript
gulp.task('scripts', function() {

	// Use a custom filter so we only lint custom JS
	const CUSTOMFILTER = filter(ASSETS.scripts + '**/*.js', {restore: true});

	return gulp.src(SOURCE.scripts)
		.pipe(plugin.plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
		.pipe(plugin.sourcemaps.init())
		.pipe(plugin.babel({
			presets: ['es2015'],
			compact: true,
			ignore: ['what-input.js']
		}))
		.pipe(plugin.concat('scripts.js'))
		.pipe(plugin.uglify())
		.pipe(plugin.sourcemaps.write('.')) // Creates sourcemap for minified JS
		.pipe(gulp.dest(ASSETS.scripts))
    .pipe(print(function() { return 'Scripts Complete.'; }));
});

// Compile Sass, Autoprefix and minify
gulp.task('styles', function() {
	return gulp.src(SOURCE.styles)
		.pipe(plugin.plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
		.pipe(plugin.sourcemaps.init())
		.pipe(plugin.sass())
		.pipe(plugin.autoprefixer({
		    browsers: [
		    	'last 2 versions',
		    	'ie >= 9',
  				'ios >= 7'
		    ],
		    cascade: false
		}))
		.pipe(plugin.cssnano({safe: true, minifyFontValues: {removeQuotes: false}}))
		.pipe(plugin.sourcemaps.write('.'))
		.pipe(gulp.dest(ASSETS.styles))
    .pipe(print(function() { return 'Styles Complete.'; }));
});

// Watch files for changes (without Browser-Sync)
gulp.task('watch', function() {

	// Watch .scss files
	gulp.watch(SOURCE.styles, gulp.parallel('styles'));

	// Watch scripts files
	gulp.watch(SOURCE.scripts, gulp.parallel('scripts'));
});

// Run styles, scripts and foundation-js
gulp.task('default', gulp.parallel('styles', 'scripts'));

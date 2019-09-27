// GULP PACKAGES
// Most packages are lazy loaded
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    filter = require('gulp-filter'),
    touch = require('gulp-touch-cmd'),
    plugin = require('gulp-load-plugins')();


// GULP VARIABLES
// Modify these variables to match your project needs

// Select Foundation components, remove components project will not use
const SOURCE = {
	scripts: [
		// Place custom JS here, files will be concantonated, minified if ran with --production
		'assets/scripts/js/**/*.js',
  ],

	// Scss files will be concantonated, minified if ran with --production
	styles: 'assets/styles/scss/**/*.scss',
};

const ASSETS = {
	styles: 'assets/styles/',
	scripts: 'assets/scripts/',
	images: 'assets/images/',
  svg: 'assets/svg/',
  svg_inline: 'assets/svg/inline',
	all: 'assets/'
};

// GULP FUNCTIONS
// JSHint, concat, and minify JavaScript
gulp.task('scripts', function() {

	// Use a custom filter so we only lint custom JS
	const CUSTOMFILTER = filter(ASSETS.scripts + 'js/**/*.js', {restore: true});

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
		.pipe(CUSTOMFILTER)
			.pipe(plugin.jshint(JSHINT_CONFIG))
			.pipe(plugin.jshint.reporter('jshint-stylish'))
			.pipe(CUSTOMFILTER.restore)
		.pipe(plugin.concat('scripts.js'))
		.pipe(plugin.uglify())
		.pipe(plugin.sourcemaps.write('.')) // Creates sourcemap for minified JS
		.pipe(gulp.dest(ASSETS.scripts))
		.pipe(touch());
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
    .pipe(browserSync.reload({
      stream: true
    }))
		.pipe(touch());
});

// Browser-Sync watch files and inject changes
gulp.task('browsersync', function() {

  // Watch these files
  var files = [
  	SOURCE.php,
  ];

  gulp.watch(SOURCE.styles, gulp.parallel('styles'));
  gulp.watch(SOURCE.scripts, gulp.parallel('scripts')).on('change', browserSync.reload);

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

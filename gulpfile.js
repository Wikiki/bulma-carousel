var package       = require('./package.json')
var gulp          = require('gulp');

var autoprefixer  = require('autoprefixer');
var babel         = require('gulp-babel');
var camelCase     = require('camelcase');
var cleancss      = require('gulp-clean-css');
var concat        = require('gulp-concat');
var del           = require('del');
var gutil         = require('gulp-util');
var minify        = require('gulp-babel-minify');
var postcss       = require('gulp-postcss');
var rollup        = require('gulp-better-rollup');
var runSequence   = require('run-sequence');
var sass          = require('gulp-sass');

/**
 * ----------------------------------------
 *  VARIABLES
 * ----------------------------------------
 */
const paths = {
  src:  'src/',
  dist: 'dist/',
  bulma: 'node_modules/bulma/sass/utilities/'
};
const config = {
  sass: {
    input: 'index.sass',
    dependencies: ['node_modules/bulma/sass/utilities/_all.sass'],
    output: {
      filename: package.name,
      format: 'compressed'
    },
    source: paths.src + 'sass/',
    destination: paths.dist + 'css/'
  },
  javascript: {
    input: 'index.js',
    output: {
      name: camelCase(package.name),
      filename: package.name,
      format: 'umd'
    },
    source: paths.src + 'js/',
    destination: paths.dist + 'js/'
  }
};

/**
 * ----------------------------------------
 *  BUILD STYLESHEETS TASKS
 * ----------------------------------------
 */
// Uses Sass compiler to process styles, adds vendor prefixes, minifies, then
// outputs file to the appropriate location.
gulp.task('build:styles', function() {
  return gulp
    .src(config.sass.dependencies.concat([config.sass.source + config.sass.input]))
    .pipe(concat(config.sass.output.filename + '.sass'))
    .pipe(sass({
      style: config.sass.output.format,
      trace: true,
      loadPath: [config.sass.source],
      includePaths: ['node_modules/bulma/sass/utilities/']
    }))
    .pipe(concat(config.sass.output.filename + (config.sass.output.format === 'compressed' ? '.min' : '') + '.css'))
    .pipe(postcss([autoprefixer({browsers: package.broswers})]))
    .pipe(cleancss())
    .pipe(gulp.dest(config.sass.destination));
});

// Copy original sass file to dist
gulp.task('build:styles:copy', function() {
  return gulp.src(config.sass.source + config.sass.input)
    .pipe(concat(config.sass.output.filename + '.sass'))
    .pipe(gulp.dest(config.sass.destination));
});

gulp.task('clean:styles', function() {
 del([
   config.sass.destination + config.sass.output.filename + '.sass',
   config.sass.destination + config.sass.output.filename + (config.sass.output.format === 'compressed' ? '.min' : '') + '.css'
 ]);
});

/**
 * ----------------------------------------
 *  BUILD JAVASCRIPT TASKS
 * ----------------------------------------
 */
 // Concatenates and uglifies global JS files and outputs result to the
 // appropriate location.
gulp.task('build:scripts', function() {
  return gulp
    .src(config.javascript.source + config.javascript.input)
    .pipe(rollup({
      plugins: [babel({ babelrc: true })]
    }, {
      format: config.javascript.output.format,
      name: config.javascript.output.name
    }).on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString())
    }))
    .pipe(concat(config.javascript.output.filename + '.js'))
    .pipe(gulp.dest(config.javascript.destination))
    .pipe(concat(config.javascript.output.filename + '.min.js'))
    .pipe(minify().on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString())
    }))
    .pipe(gulp.dest(config.javascript.destination)
    .on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString())
    }));
});

gulp.task('clean:scripts', function() {
  del([
    config.javascript.destination + mainJsFile,
    config.javascript.destination + distJsFile
  ]);
});

/**
 * ----------------------------------------
 *  GLOBAL BUILD
 * ----------------------------------------
 */
gulp.task('build', function(callback) {
  runSequence('clean',
    ['build:styles'],
    ['build:styles:copy'],
    ['build:scripts'],
    callback);
});

/**
 * ----------------------------------------
 *  GLOBAL CLEAN
 * ----------------------------------------
 */
// Deletes the entire dist directory.
gulp.task('clean', function() {
  del(paths.dist);
});

/**
 * ----------------------------------------
 *  DEFAULT TASK
 * ----------------------------------------
 */
gulp.task('default', ['build']);

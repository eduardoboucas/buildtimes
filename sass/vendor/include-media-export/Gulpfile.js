'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var packageInfo = require('./package.json');


// -----------------------------------------------------------------------------
// Dist
// -----------------------------------------------------------------------------

gulp.task('compress', function() {
  return gulp.src('./include-media.js')
    .pipe(plugins.uglify())
    .pipe(plugins.rename({
      suffix: '-' + packageInfo.version + '.min'
    }))
    .pipe(gulp.dest('./dist'));
});

// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------

gulp.task('default', ['compress']);

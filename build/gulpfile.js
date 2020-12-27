const gulp = require('gulp');

const npm = {
    uglify: require('gulp-uglify'),
    sourcemaps: require('gulp-sourcemaps'),
    rename: require('gulp-rename'),
    header: require('gulp-header'),
    gzip: require('gulp-gzip')
};

const SOURCE = '../dist/index.js';
const DEST = 'path-value.min.js';

const version = require('../package.json').version;

const copyright = `/**
 * path-value v${version}
 * Copyright 2020 Vitaly Tomilov
 * Released under the MIT License
 * https://github.com/vitaly-t/path-value
 */
`;

gulp.task('minify', () => {
    return gulp.src(SOURCE)
        .pipe(npm.sourcemaps.init())
        .pipe(npm.uglify())
        .pipe(npm.header(copyright))
        .pipe(npm.rename(DEST))
        .pipe(npm.sourcemaps.write('.'))
        .pipe(gulp.dest('../dist/web'));
});

gulp.task('zip', () => {
    return gulp.src('../dist/web/path-value.min.js')
        .pipe(npm.gzip({extension: 'gzip'}))
        .pipe(gulp.dest('../dist'));
});

gulp.task('default', gulp.series(['minify', 'zip']));

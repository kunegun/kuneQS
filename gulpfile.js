'use strict';

const browserSync = require('browser-sync');
const connect = require('gulp-connect-php');
const cssnano = require('gulp-cssnano');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const prefixer = require('autoprefixer-stylus');
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const reload = browserSync.reload;

const devPaths = {
    js: 'dev/js/main.js',
    css: 'dev/stylus/**/*.styl',
    mainStyl: 'dev/stylus/main.styl',
    img: 'dev/img/**/*'
};
const deployPaths = {
    js: 'deploy/js/',
    css: 'deploy/css/',
    img: 'deploy/img'
};

gulp.task('css', () => {
    gulp.src(devPaths.mainStyl)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: [prefixer()],
            compress: true
        }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(deployPaths.css))
        .pipe(browserSync.stream());
});
gulp.task('images', () => {
    gulp.src(devPaths.img)
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(deployPaths.img));
});

gulp.task('connect-sync', function() {
  connect.server({
  	port: 7777,
  	open:false,
  	stdio: 'ignore'
  }, function (){
    browserSync({
    	logLevel: "info",
    	notify: true,
		proxy: '127.0.0.1:7777',
		port: 4444,
		browser: 'firefox'
    });
  });

  gulp.watch('*.php').on('change', reload);

});

gulp.task('watch', function() {
	gulp.watch(devPaths.mainStyl, ['css']);
	gulp.watch(devPaths.img, ['images']);
});

gulp.task('default', ['watch', 'connect-sync']);
'use strict';

import browserSync from 'browser-sync';
import connect from 'gulp-connect-php';
import cssnano from 'gulp-cssnano';
import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import prefixer from 'autoprefixer-stylus';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';

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
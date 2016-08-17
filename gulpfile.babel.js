'use strict';

import browserSync from 'browser-sync';
import connect from 'gulp-connect-php';
import cssnano from 'gulp-cssnano';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import prefixer from 'autoprefixer-stylus';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';

const reload = browserSync.reload;
const devPaths = {
    js: 'dev/js/**/*',
    css: 'dev/stylus/**/*.styl',
    mainStyl: 'dev/stylus/main.styl',
    img: 'dev/img/**/*'
};
const deployPaths = {
    js: 'deploy/js/',
    css: 'deploy/css/',
    img: 'deploy/img'
};
// Compile CSS
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
// Optimize images
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
// Scripts
gulp.task('lint', () =>
  gulp.src(devPaths.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);
gulp.task('scripts', () => {
    gulp.src(devPaths.js)
        .pipe(plumber())
        .pipe(gulp.dest(deployPaths.js));
});
// Copy all files at the root level (dev) except the stylus folder
gulp.task('copy', () =>
  gulp.src([
    'dev/**',
    '!dev/stylus',
    '!dev/stylus/**',
  ], {
    dot: true
  }).pipe(gulp.dest('deploy/web'))
);
// Watch files for changes & reload
gulp.task('connect-sync', function() {
  connect.server({
  	port: 7777,
  	open:false,
  	stdio: 'ignore'
  }, function (){
    browserSync({
    	logLevel: "info",
        logPrefix: 'KQS',
    	notify: true,
		proxy: '127.0.0.1:7777',
		port: 4444,
		browser: 'firefox'
    });
  });



});

gulp.task('watch', function() {
    gulp.watch('*.php').on('change', reload);
	gulp.watch(devPaths.mainStyl, ['css']);
	gulp.watch(devPaths.img, ['images']);
    gulp.watch(devPaths.js, ['lint', 'scripts']);
});

gulp.task('default', ['watch', 'connect-sync']);
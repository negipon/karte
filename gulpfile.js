var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var frontnote = require('gulp-frontnote');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
gulp.task('sass',function(){
    gulp.src(['src/scss/**/*.scss'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(frontnote({
            out: 'docs/css'
        }))
        // .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log:true}))
        .pipe(gulp.dest('public/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCss())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
});
gulp.task('js',function(){
    gulp.src(['src/js/**/*.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('public/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
});
gulp.task('html',function(){
    gulp.src(['html/**/*.html'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('./'))
});
gulp.task('default',function(){
    gulp.watch('src/js/**/*.js',['js']);
    gulp.watch('src/scss/**/*.scss',['sass']);
    gulp.watch('html/**/*.html',['html']);
});

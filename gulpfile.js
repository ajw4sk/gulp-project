var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');

var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function() {
   log('Compiling Less --> CSS');

   return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())

        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function() {
    var files = config.temp + '**/**.css';
    clean(files);
});

gulp.task('less-watcher', function() {
    gulp.watch([config.less], ['styles']);
});

gulp.task('wiredep', function() {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions(); //todo
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index) ///todo index.html
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client)); //todo config
});

gulp.task('inject', ['wiredep', 'styles'], function() {
    log('Wire up the app css into the html, and call wiredep');
    var options = config.getWiredepDefaultOptions(); //todo
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index) ///todo index.html
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client)); //todo config
});

////////////functions

function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path).then(log('delete done'));
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

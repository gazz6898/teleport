const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const uglify = require('gulp-uglify');

function build() {
  return gulp
    .src('src/**/*.js')
    .pipe(babel({ presets: ['@babel/env'], plugins: ['@babel/transform-runtime'] }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
}

exports.build = build;

function watch() {
  return gulp.watch('src/**/*.js', build);
}

exports.watch = watch;

gulp.task('start:dev', function (done) {
  const stream = nodemon({
    script: 'dist/index.js',
    ext: 'js',
    ignore: ['dist/**/*'],
    tasks: ['build'],
    done,
  });

  stream
    .on('restart', function () {
      console.log('Restarted!');
    })
    .on('crash', function () {
      console.error('Crashed! (Will restart in 10 sec)');
      stream.emit('restart', 10);
    });
});

exports.default = watch;

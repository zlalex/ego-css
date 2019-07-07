var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify');

// 编译sass
gulp.task('sass', function() {
    gulp.src(['./public/src/scss/*.scss', './public/src/scss/layout/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest('./dist/css'))
        .pipe(reload({ stream: true }));
});

// 自动添加私有前缀
gulp.task('auto-prefixer', function() {

    // 如果 gulp.dest(源文件) 为同一个文件，会抛出编译错误。
    gulp.src('./dist/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'], //http://browserl.ist/
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest('./dist/css/prefixer'));
})

// 压缩js文件
gulp.task('script', function() {
    gulp.src('./public/src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
})

// 监听文件变化同步浏览器
gulp.task('service', ['sass'], function() {
    browserSync.init({
        server: './dist'
    });

    gulp.watch(['./public/src/scss/*.scss', './public/src/scss/layout/*.scss'], ['sass']);

    gulp.watch('./dist/css/*.css', ['auto-prefixer']);

    gulp.watch('./public/src/js/*.js', ['script'])

    gulp.watch(['./dist/index.html', './dist/html/*.html']).on('change', reload);
});

// 默认任务
gulp.task('server', ['service', 'auto-prefixer']);
const { dest, src, watch, parallel, series } = require("gulp")
const concat = require('gulp-concat');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();

const sass = require('gulp-sass')(require('sass'));

const styles = () => {
    return src('src/Scss/index.scss')
        .pipe(concat('main.min.css'))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(dest('public/css'))
        .pipe(browserSync.stream())
}

const scripts = () => {
    return src('src/Scripts/Main.js')
        .pipe(webpack({
            mode: 'development',
            output: {
                filename: 'main.min.js'
            }
        }))
        .pipe(dest('public/js'))
        .pipe(browserSync.stream())
}

const watching = () => {
    watch(['src/Scripts/Main.js'], scripts)
    watch(['src/Scss/index.scss'], styles)
    watch(['public/*.html']).on('change', browserSync.reload)
}

const liveServer = () => {
    browserSync.init({
        server: "public/",
    })
}

const buildStyles = () => {
    return src('src/Scss/index.scss')
        .pipe(concat('main.min.css'))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(dest('build/css'))
}

const buildScripts = () => {
    return src('src/Scripts/Main.js')
        .pipe(webpack({
            mode: "production",
            output: {
                filename: 'main.min.js'
            }
        }))
        .pipe(dest('build/js'))
}

const html = () => {
    return src('public/index.html')
        .pipe(dest('build/'))
}

const pages = () => {
    return src('src/Pages')
    .pipe(dest('build/'))
}

exports.styles = styles
exports.scripts = scripts
exports.watching = watching
exports.liveServer = liveServer
exports.build = series(html, buildStyles, buildScripts,pages)

exports.default = parallel(styles, scripts, liveServer, watching)
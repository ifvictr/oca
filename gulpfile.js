const gulp = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

gulp.task("default", ["watch"]);

gulp.task("minify", ["minify-css", "minify-js"]);

gulp.task("minify-css", () => {
    return gulp.src(["static/css/*.css", "!static/css/wee.min.css"])
        .pipe(autoPrefixer())
        .pipe(cleanCSS({compatibility: "ie8"}))
        .pipe(concat("wee.min.css"))
        .pipe(gulp.dest("static/css/"));
});

gulp.task("minify-js", () => {
    return gulp.src(["static/js/*.js", "!static/js/wee.min.js"])
        .pipe(uglify())
        .pipe(concat("wee.min.js"))
        .pipe(gulp.dest("static/js/"));
});

gulp.task("watch", ["watch-css", "watch-js"]);

gulp.task("watch-css", () => gulp.watch(["static/css/*.css", "!static/css/wee.min.css"], ["minify-css"]));

gulp.task("watch-js", () => gulp.watch(["static/js/*.js", "!static/js/wee.min.js"], ["minify-js"]));
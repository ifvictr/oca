var gulp = require("gulp");
var autoPrefixer = require("gulp-autoprefixer");
var cleanCSS = require("gulp-clean-css");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
gulp.task("minify-css", function(){
    return gulp
        .src("public/assets/css/oca.css")
        .pipe(autoPrefixer())
        .pipe(cleanCSS({compatibility: "ie8"}))
        .pipe(concat("oca.min.css"))
        .pipe(gulp.dest("public/assets/css/"));
});
gulp.task("minify-js", function(){
    return gulp
        .src(["public/assets/js/clipboard.min.js", "public/assets/js/jquery.min.js", "public/assets/js/oca.js"])
        .pipe(uglify())
        .pipe(concat("oca.min.js"))
        .pipe(gulp.dest("public/assets/js/"));
});
gulp.task("watch", function(){
    gulp.watch(["public/assets/css/*.css", "!public/assets/css/oca.min.css"], ["minify-css"]);
    gulp.watch(["public/assets/js/*.js", "!public/assets/js/oca.min.js"], ["minify-js"]);
});
gulp.task("default", ["minify-css", "minify-js"]);
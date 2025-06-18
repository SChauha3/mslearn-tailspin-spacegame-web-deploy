/// <binding Clean='clean' />
"use strict";

const gulp = require("gulp"),
      rimraf = require("rimraf"),
      concat = require("gulp-concat"),
      cleanCSS = require("gulp-clean-css"),
      uglify = require("gulp-uglify"),
      sass = require('gulp-sass')(require('sass')); // <--- ADD THIS LINE (Important: pass 'sass' to gulp-sass)

const paths = {
    webroot: "./Tailspin.SpaceGame.Web/wwwroot/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.sass = paths.webroot + "css/**/*.scss"; // <--- ADD THIS LINE: Path to your Sass files

paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css"; // This will now be the output of concatenated *compiled* CSS

gulp.task("clean:js", done => rimraf(paths.concatJsDest, done));
gulp.task("clean:css", done => rimraf(paths.concatCssDest, done));
gulp.task("clean", gulp.series(["clean:js", "clean:css"]));

// Task to compile Sass files to CSS
gulp.task("min:sass", () => {
    return gulp.src(paths.sass) // Source all .scss files
        .pipe(sass().on('error', sass.logError)) // Compile Sass. .on('error', ...) is good for debugging
        .pipe(gulp.dest(paths.webroot + "css")); // Output compiled CSS to the same directory as original Sass or a dedicated 'css' folder
});

gulp.task("min:js", () => {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", () => {
    // This task should now process the CSS files *after* Sass has compiled them.
    // Ensure your Sass compilation creates .css files that this task can then pick up.
    // If your Sass files are in Tailspin.SpaceGame.Web/wwwroot/css, they will compile to .css files in the same directory.
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cleanCSS())
        .pipe(gulp.dest("."));
});

// Update the 'min' task to run Sass compilation before CSS minification
gulp.task("min", gulp.series(["min:sass", "min:js", "min:css"])); // <--- UPDATED ORDER

// A 'default' task is required by Gulp v4
gulp.task("default", gulp.series(["min"]));
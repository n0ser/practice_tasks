import gulp from "gulp";

import dartSass from 'sass';
import gulpSass from 'gulp-sass';

import csso from "gulp-csso";
import include from "gulp-file-include";
import htmlmin from "gulp-htmlmin";
import { deleteAsync } from "del";
import sync from "browser-sync";
import concat from "gulp-concat";
import autoPrefixer from "gulp-autoprefixer";

const { src, dest, series, watch} = gulp;
const sass = gulpSass(dartSass);

gulp.task("html", function () {
  return src("src/**.html")
    .pipe(
      include({
        prefix: "@@",
      }))
      .pipe(htmlmin({
        collapseWhitespace: false
      }))
    .pipe(dest("dist"));
});



gulp.task("scss", function () {
  return src("src/scss/**.scss")
    .pipe(sass())
    .pipe(autoPrefixer({
        browsers: ["last 2 version"]
    }))
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('dist'))
});

gulp.task("processImages", function () {
  return src('./src/img/**/*.{gif,jpg,png,svg}')
  .pipe(dest('dist/image'))
  });

gulp.task("clear", function() {
  return deleteAsync('dist')
});

gulp.task("build", series("clear", "html", "scss"));

gulp.task("serve", function(){
  sync.init({
    server: './dist'
  })

  watch('src/**.html', series("html")).on('change', sync.reload)
  watch('src/scss/**.scss', series("scss")).on('change', sync.reload)
});

gulp.task("server", series("clear","processImages", "scss", "html", "serve"))

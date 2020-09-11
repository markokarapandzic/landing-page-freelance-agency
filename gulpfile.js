const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();

function compileSass() {
  return src("./src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./src/css"))
    .pipe(browserSync.stream());
}

function watchSass() {
  browserSync.init({
    server: {
      baseDir: "./src",
    },
  });
  watch("./src/scss/**/*.scss").on("change", compileSass);
  watch("./src/*.html").on("change", browserSync.reload);
  watch("./src/js/**/*.js").on("change", browserSync.reload);
}

exports.watch = watchSass;

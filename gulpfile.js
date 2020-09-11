var { src, dest, series, watch } = require("gulp");
var sass = require("gulp-sass");

sass.compiler = require("node-sass");

function buildSass() {
  return src("./src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError()))
    .pipe(gulp.dest("./src/css"));
}

function watchSass() {
  watch([buildSass()], function (callback) {
    callback();
  });
}

exports.default = series(watchSass());

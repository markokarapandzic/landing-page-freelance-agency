const fs = require('fs');
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const image = require('gulp-image');
const webp = require('gulp-webp');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify-es').default;

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

// Build Config
function preBuild(next) {
  if (fs.existsSync('./dist')) {
    return src('./dist/', { read: false })
      .pipe(clean());
  } else {
    return next();
  }
}

function compressImages() {
  return src('./src/images/*')
    .pipe(image())
    .pipe(webp())
    .pipe(dest('dist/images'));
}

function minifyCSS() {
  return src('./src/css/**/*.css')
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(dest('dist/css'));
}

function minifyJS() {
  return src('./src/js/*')
    .pipe(uglify())
    .pipe(dest('./dist/js'));
}

function moveIndexHTML() {
  return src('./src/index.html')
    .pipe(dest('dist/'));
}

exports.watch = watchSass;
exports.build = series(
  preBuild,
  compileSass,
  minifyCSS,
  minifyJS,
  compressImages,
  moveIndexHTML
);

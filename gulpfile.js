const { src, series, parallel, dest, watch } = require("gulp");
const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const browsersync = require("browser-sync").create();

function compile() {
  return src("src/scss/main.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename("main.min.css"))
    .pipe(dest("dist/css", { sourcemaps: "." }));
}

function html() {
  return src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("dist"));
}

function js() {
  return src("src/js/**/*.js", { sourcemaps: true })
    .pipe(concat("all.js"))
    .pipe(terser())
    .pipe(dest("dist/js", { sourcemaps: "." }));
}

function img() {
  return src("src/img/**/*.*").pipe(imagemin()).pipe(dest("dist/img"));
}

function sync(cb) {
  browsersync.init({
    server: {
      baseDir: "./dist",
    },
  });
  cb();
}

function syncReload(cb) {
  browsersync.reload();
  cb();
}

function watcher() {
  watch(["src/scss/**/*.scss"], series(compile, syncReload));
  watch(["src/**/*.html"], series(html, syncReload));
  watch(["src/js/**/*.js"], series(js, syncReload));
  watch(["src/img/**/*.*"], series(img, syncReload));
}

exports.compile = compile;
exports.html = html;
exports.js = js;
exports.img = img;
exports.default = series(compile, html, js, img, sync, watcher);

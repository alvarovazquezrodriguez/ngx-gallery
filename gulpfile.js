const gulp = require('gulp');
const sass = require('node-sass');
const inlineTemplates = require('gulp-inline-ng2-template');
const copyfiles = require('copyfiles');
const cssimport = require("gulp-cssimport");
const replace = require('gulp-ext-replace');

const SCSS_CONF = {
  SRC: './styles.scss',
  DIST: './dist'
};

gulp.task('styles', (callback) => {
  return gulp.src(SCSS_CONF.SRC)
    .pipe(cssimport({}))
    .pipe(gulp.dest(SCSS_CONF.DIST));
});

const FILES = [
  'CHANGELOG.md',
  'LICENSE',
  'README.md',
  'package.json',
  'styles.scss',
  '.npmignore',
  'dist'
];

gulp.task('copy.files', (callback) => {
  copyfiles(FILES, true, callback);
});

gulp.task('copy-theme', (callback) => {
  copyfiles(['src/components/gallery/gallery.component.scss', 'dist'], true, callback);
});

gulp.task('copy-theme', (callback) => {
  copyfiles(['src/components/gallery/gallery-arrows.component.scss', 'dist'], true, callback);
});

gulp.task('copy-theme', (callback) => {
  copyfiles(['src/components/gallery/gallery-bullets.component.scss', 'dist'], true, callback);
});

gulp.task('copy-theme', (callback) => {
  copyfiles(['src/components/gallery/gallery-image.component.scss', 'dist'], true, callback);
});

gulp.task('copy-theme', (callback) => {
  copyfiles(['src/components/gallery/gallery-preview.component.scss', 'dist'], true, callback);
});

gulp.task('copy-theme', (callback) => {
  copyfiles(['src/components/gallery/gallery-thumbnails.component.scss', 'dist'], true, callback);
});

gulp.task('copy-files', gulp.series('copy-theme', 'copy.files'));

/**
 * Compile SASS to CSS.
 * @see https://github.com/ludohenin/gulp-inline-ng2-template
 * @see https://github.com/sass/node-sass
 */
function compileSass(path, ext, file, callback) {
  let compiledCss = sass.renderSync({
    file: path,
    outputStyle: 'compressed',
  });
  callback(null, compiledCss.css);
}

/**
 * Inline templates configuration.
 * @see  https://github.com/ludohenin/gulp-inline-ng2-template
 */
const INLINE_TEMPLATES_CONF = {
  SRC: ['./**/*.ts', '!./tmp/**/*', '!./node_modules/**/*', '!./demo-app/**/*' , '!./custom-typings.d.ts'],
  DIST: './tmp',
  CONFIG: {
    base: '.',
    target: 'es6',
    useRelativePaths: true,
    styleProcessor: compileSass
  }
};

/**
 * Inline external HTML and SCSS templates into Angular component files.
 * @see: https://github.com/ludohenin/gulp-inline-ng2-template
 */
gulp.task('inline-templates', () => {
  return gulp.src(INLINE_TEMPLATES_CONF.SRC)
    .pipe(inlineTemplates(INLINE_TEMPLATES_CONF.CONFIG))
    .pipe(gulp.dest(INLINE_TEMPLATES_CONF.DIST));
});
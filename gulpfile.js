var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint'),
	clean = require('gulp-clean'),
	sass = require('gulp-sass');

gulp.task('jshint', function() {
	return gulp.src('app/javascript/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
	gulp.watch('app/javascript/**/*.js', ['jshint']);
	gulp.watch('app/*.html', ['copyHtml']);
	gulp.watch('app/templates/*.html', ['copyHtml']);
	gulp.watch('app/scss/*.scss', ['sass']);
});

gulp.task('serve',function() {
	browserSync.init({
		server: "./public"
	});

	gulp.watch("public/**/*.*").on('change', browserSync.reload);
});

gulp.task('sass', function() {
	return gulp.src("app/scss/main.scss")
		.pipe(sass())
		.pipe(gulp.dest("public/css"))
		.pipe(browserSync.stream());
});

gulp.task('copyHtml', function() {
	// copy any html files in source/ to public/
	gulp.src('app/*.html')
		.pipe(gulp.dest('public'));

	gulp.src('app/templates/*.html')
		.pipe(gulp.dest('public/templates'));
});

gulp.task('copyVendorScripts', function() {
	// copy any vendor files in node_modules/ to public/vendor
	gulp.src('node_modules/angular/angular.js')
		.pipe(gulp.dest('public/vendor/angular'));

	gulp.src('node_modules/jquery/dist/*.*')
		.pipe(gulp.dest('public/vendor/jquery'));

	gulp.src('node_modules/bootstrap/dist/css/*.*')
		.pipe(gulp.dest('public/vendor/bootstrap/css'));

	gulp.src('node_modules/bootstrap/dist/js/*.*')
		.pipe(gulp.dest('public/vendor/bootstrap/js'));

	gulp.src('node_modules/bootstrap/dist/fonts/*.*')
		.pipe(gulp.dest('public/vendor/bootstrap/fonts'));

	gulp.src('app/templates/*.*')
		.pipe(gulp.dest('public/templates'));

	gulp.src('node_modules/lodash/*.*')
		.pipe(gulp.dest('public/vendor/lodash'));

	gulp.src('node_modules/restangular/dist/restangular.js')
		.pipe(gulp.dest('public/vendor/restangular'));

	gulp.src('node_modules/angular-ui-router/release/angular-ui-router.js')
		.pipe(gulp.dest('public/vendor/angular-ui-router'));
});

gulp.task('build', ['copyHtml', 'jshint', 'copyVendorScripts', 'sass']);

gulp.task('clean', function () {
	return gulp.src('public', {read: false})
		.pipe(clean());
});

gulp.task('default', ['serve', 'watch']);

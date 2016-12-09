var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('start', function() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	gulp.watch("*.html").on("change", browserSync.reload());	
	gulp.watch("*.js").on("change", browserSync.reload());
});
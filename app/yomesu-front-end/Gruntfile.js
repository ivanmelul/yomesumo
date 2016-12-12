var http = require('http');

module.exports = function(grunt) {
	var webAppFolder = 'src/';
	var buildFolder = 'build/';

	var cssDestination = {};
	cssDestination[buildFolder + '/styles/bundle.css'] = buildFolder + 'styles/bundle.scss';

	var configurationFile = grunt.option('enviroment') || 'confDev.js'; // confProd.js
	console.log('CONFIGURACION: ' + configurationFile);

	grunt.initConfig({
		sass: {
			bundle: {
				options: {
					style: 'expanded'
				},
				files: cssDestination
			}
		},
		copy: {
			main: {
				files: [
				  // includes files within path and its sub-directories
				  // copio los templates a la carpeta build
					// {
					//   cwd: webAppFolder,
					//   expand: true,
					//   flatten: true,
					//   src: [ 'modules/**/*.html'],
					//   dest:  buildFolder + 'templates/'
					// },
					// copio el index.html
					{
						cwd: webAppFolder,
						expand: true,
						src: [ 'index.html'],
						dest:  buildFolder
					},
					// copio imagenes
					{
						cwd: webAppFolder,
						expand: true,
						flatten: true,
						src: [ 'modules/**/*.jpg', 'modules/**/*.jpeg', 'modules/**/*.png', 'modules/**/*.gif', 'modules/**/*.ico'],
						dest:  buildFolder + 'images/'
					},
					// copio las fonts awesome
					{
						cwd: '.',
						expand: true,
						flatten: true,
						src: [ 'node_modules/font-awesome/fonts/*.*'],
						dest:  buildFolder + 'fonts/'
					},
				]}
			},
			clean: {
				oldBuild: {
					options: { force: true },
					src: [buildFolder]
				},
				scssFile: {
					options: { force: true },
					src: [buildFolder + 'styles/bundle.scss']
				}
			},
			concat: {
				js: {
					src: [webAppFolder + configurationFile, webAppFolder + 'main.js', webAppFolder + 'modules/*/index.js' ,webAppFolder + 'modules/*/**/*.js'],
					dest: buildFolder + 'scripts/bundle.js',
				},
				scss: {
					src: [webAppFolder + '**/*.scss'],
					dest: buildFolder + 'styles/bundle.scss',
				},
				html: {
					src: [webAppFolder + 'modules/**/*.html'],
					dest: buildFolder + 'templates/bundle.html',
					options: {
						process: function(file, path){
							console.log('Processing: ' + path);
							var resp = '<script type="text/ng-template" id="templates/' + path.substr(path.lastIndexOf('/') + 1) + '">' + file + '</script>'
							return resp;
						}
					}
				},
				thirdPartJs: {
					src: [
						'node_modules/angular/angular.min.js',
						'node_modules/angular-ui-router/release/angular-ui-router.min.js',
						'node_modules/angular-aria/angular-aria.min.js',
						'node_modules/angular-animate/angular-animate.min.js',
						'node_modules/angular-material/angular-material.min.js',
						'node_modules/angular-password/angular-password.min.js',
						'node_modules/ngmap/build/scripts/ng-map.min.js',
						'node_modules/lf-ng-md-file-input/dist/lf-ng-md-file-input.min.js',
						'node_modules/angular-scroll/angular-scroll.min.js'
					],
					dest: buildFolder + 'scripts/third-part-bundle.js',
				},
				thirdPartCss: {
					src: [
						'node_modules/angular-material/angular-material.min.css',
						'node_modules/font-awesome/css/font-awesome.min.css',
						'node_modules/lf-ng-md-file-input/dist/lf-ng-md-file-input.min.css'
					],
					dest: buildFolder + 'styles/third-part-bundle.css',
				}
			},
			connect: {
				server: {
					options: {
						hostname:'*',
						port: 8000,
						base:buildFolder,
						open:true
					}
				}
			},
			watch:{
				files: [ webAppFolder + '**'],
				tasks: ['rebuild']
			},
			uglify: {
				default: {
					options: {
						beautify: false
					},
					files: [{
						src: [webAppFolder + configurationFile, webAppFolder + 'main.js', webAppFolder + 'modules/*/index.js' ,webAppFolder + 'modules/*/**/*.js'],
						dest: buildFolder + 'scripts/bundle.js',
					}]
				}
			},
			jshint: {
				options: {
					jshintrc: '.jshintrc'
				},
				default: ['src/**/*.js']
			}
	  });

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('grunt-contrib-jasmine');


	// esta tarea hay que correrla la primera vez que se levabta el sitio
	grunt.registerTask('default',['jshint', 'clean:oldBuild', 'concat:js', 'concat:thirdPartJs', 'concat:thirdPartCss', 'concat:scss', 'concat:html', 'copy', 'sass', 'clean:scssFile', 'connect', 'watch']);

	// esta tarea se corre cuando  se modifica un archivo
	grunt.registerTask('rebuild',['jshint','clean:oldBuild', 'concat:js', 'concat:thirdPartJs', 'concat:thirdPartCss', 'concat:scss', 'concat:html', 'copy', 'sass', 'clean:scssFile']);

	// build para produccion
	grunt.registerTask('release',['jshint', 'clean:oldBuild', 'uglify', 'concat:thirdPartJs', 'concat:thirdPartCss', 'concat:scss', 'concat:html', 'copy', 'sass', 'clean:scssFile']);

	grunt.registerTask('foo',['jshint']);
};

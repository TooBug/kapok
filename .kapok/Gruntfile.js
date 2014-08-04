module.exports = function(grunt){

	grunt.initConfig({
		compress:{
			nw:{
				options: {
					mode:'zip',
					archive: 'app.nw'
				},
				files: [{
					src: ['**'],
					cwd: '../tmp/',
					expand: true,
					dest: './',
				}]
			}
		},
		copy:{
			prepareBuild:{
				files:[{
					src:['**','!styles/less/**','!js/*.js','js/*.min.js'],
					cwd:'../src',
					expand:true,
					dest:'../tmp'
				}]
			},
			dist:{
				files:[{
					expand:true,
					cwd:'../tmp',
					src:'**',
					dest:'../other/kapok-as-tmpl.app/Contents/Resources/app/',
				}]
			}
		},
		clean:{
			options:{
				force:true
			},
			cleanTmp:['../tmp','./app.nw']
		},
		uglify:{
			dist:{
				files:[{
					src:['js/*.js','!js/*.min.js','!js/tquery*.js'],
					dest:'../tmp/',
					expand:true,
					cwd:'../src',
					ext:'.js'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('nw', ['copy:prepareBuild','uglify:dist','copy:dist','clean:cleanTmp']);
	grunt.registerTask('test', ['uglify:dist']);

};

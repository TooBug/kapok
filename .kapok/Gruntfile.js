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
					src:['**','!styles/less/**','!js/*.js','js/jquery-1.10.2.min.js'],
					cwd:'../src',
					expand:true,
					dest:'../tmp'
				}]
			},
			nw:{
				files:[{
					src:['app.nw'],
					dest:'../other/kapok-tmpl.app/Contents/Resources/',
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
			nw:{
				files:[{
					src:['js/*.js','!js/jquery*.js','!js/tquery*.js'],
					dest:'../tmp/',
					expand:true,
					cwd:'../src',
					ext:'.js'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('nw', ['copy:prepareBuild','uglify:nw','compress:nw','copy:nw','clean:cleanTmp']);
	grunt.registerTask('test', ['uglify:nw']);

};
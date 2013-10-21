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
					src:['**','!styles/less/**'],
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
			// removeLess:['../tmp/styles/less'],
			cleanTmp:['../tmp','./app.nw']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('nw', ['copy:prepareBuild',/*'clean:removeLess',*/'compress:nw','copy:nw','clean:cleanTmp']);
	grunt.registerTask('test', ['copy:prepareBuild']);

};
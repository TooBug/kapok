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
					cwd: '../src/',
					expand: true,
					dest: './',
				}]
			}
		},
		copy:{
			nw:{
				files:[{
					src:['app.nw'],
					dest:'../other/kapok-tmpl.app/Contents/Resources/',
				}]
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('nw', ['compress:nw','copy:nw']);
	grunt.registerTask('test', ['compress:nw']);

};
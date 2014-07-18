var taskName = process.argv[2];
var path = require('path');
var grunt = require(path.join(process.cwd(),'node_modules/grunt'));
var oldLog = grunt.log;

grunt.log = {};

for(var key in oldLog){
	grunt.log[key] = function(key){
		return function(){
			var oldFunc = oldLog[key];
			process.send([key,arguments[0]]);
			return oldFunc.apply(oldLog,arguments);
		};
	}(key);
}

grunt.tasks([taskName],{
	color:false,
	gruntfile:path.join(process.cwd(),'Gruntfile.js')
},function(){
	process.send(['custom','done']);
});

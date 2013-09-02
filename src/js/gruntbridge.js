~function(window){

	var path = require('path');

	// 用于与Grunt通讯的对象，负责读取及调用Grunt
	var gruntBridge = {
		basePath:'.',
		config:{}
	};

	// 辅助方法
	var helper = {
		readJSON:function(filePath){
			// return require('./'+path.join(gruntBridge.basePath,filePath));
			return require(''+path.join(gruntBridge.basePath,filePath));
		}
	};

	// 包装的伪grunt对象，用于读取Gruntfile配置
	var grunt = {
		initConfig:readJobs,
		loadNpmTasks:readPlugins,
		registerTask:readTasks,
		file:{
			readJSON:helper.readJSON
		}
	};

	// 读取Gruntfile
	gruntBridge.getConfig = function(fileName){
		if(!fileName){
			fileName = 'Gruntfile.js';
		}
		var gruntFunc = require(path.join(gruntBridge.basePath + fileName));
		gruntFunc(grunt);
	};

	// 运行Grunt的指定任务
	gruntBridge.doCompile = function(taskName){

		var spawn = require('child_process').spawn,
		    grunt  = spawn('grunt',[taskName],{
		    	cwd:gruntBridge.basePath
		    });

		// 捕获标准输出并将其打印到控制台
		grunt.stdout.on('data', function (data) {
		    console.log('标准输出：\n' + data);
		});

		// 捕获标准错误输出并将其打印到控制台
		grunt.stderr.on('data', function (data) {
		    console.log('标准错误输出：\n' + data);
		});

		// 注册子进程关闭事件
		grunt.on('exit', function (code, signal) {
		    console.log('子进程已退出，代码：' + code);
		});

	};

	function readJobs(jobObj){

	};

	function readPlugins(pluginTaskName){

		gruntBridge.config.pluginTaskList = gruntBridge.config.pluginTaskList || [];
		gruntBridge.config.pluginTaskList.push(pluginTaskName);

	};

	function readTasks(taskName,taskJobList){
		gruntBridge.config.buildTaskList = gruntBridge.config.buildTaskList || [];
		gruntBridge.config.buildTaskList.push({
			name:taskName,
			jobList:taskJobList
		});
	};

	window.gruntBridge = gruntBridge;
	
}(window);
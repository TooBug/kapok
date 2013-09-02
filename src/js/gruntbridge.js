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
			return require('./'+path.join(gruntBridge.basePath,filePath));
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
	}




	function readJobs(jobObj){

	}

	function readPlugins(pluginTaskName){

		gruntBridge.config.pluginTaskList = gruntBridge.config.pluginTaskList || [];
		gruntBridge.config.pluginTaskList.push(pluginTaskName);

	}

	function readTasks(taskName,taskJobList){
		gruntBridge.config.buildTaskList = gruntBridge.config.buildTaskList || [];
		gruntBridge.config.buildTaskList.push({
			name:taskName,
			jobList:taskJobList
		});
	}

	window.gruntBridge = gruntBridge;
	
}(window);
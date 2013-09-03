~function(window){

	var path = require('path');

	// 用于与Grunt通讯的对象，负责读取及调用Grunt
	var gruntBridge = {
		basePath:'.',
		config:{}
	};


	// 辅助方法
	var helper = {
		// 用于grunt对象
		readJSON:function(filePath){
			// return require('./'+path.join(gruntBridge.basePath,filePath));
			return require(''+path.join(gruntBridge.basePath,filePath));
		},
		// 解析标准输出
		parseOutput:function(output,jobProgress){
			
			
			output = output + '';
			// 过滤控制颜色的标识，类似[4m、[32m
			output = output.replace(/\[\d{1,2}m/g,'');

			var newJobPattern = /Running "(.*)" \((\w+)\) task/m;
			var newJobMatch = output.match(newJobPattern);
			// console.dir(newJobMatch);

			if(newJobMatch && newJobMatch.length && newJobMatch.length >= 3){
				// 进入新Job

				// 先将之前的Job全部置为完成
				jobProgress.forEach(function(jobItem){
					jobItem.status = 'done';
					jobItem.progress = 100;
				});

				// 然后push新Job
				jobProgress.push({
					name:newJobMatch[1],
					status:'doing',
					progress:10
				});

			}else{
				// 没有匹配到新的Job，更新之前的进度
				var targetJobArr = jobProgress.filter(function(jobItem){
					return jobItem.status === 'doing';
				});

				if(targetJobArr && targetJobArr.length){
					targetJobArr[0].progress += 10;
					if(targetJobArr[0].progress >= 90){
						targetJobArr[0].progress = 90;
					}
				}

			}

			// return jobProgress;

		},
		// 解析进程退出代码
		parseExit:function(code,jobProgress){
			switch(code){

				// 正常退出
				case 0:
					jobProgress.forEach(function(jobItem){
						jobItem.status = 'done';
						jobItem.progress = '100';
					});
					break;
				// 报错
				case 3:
					jobProgress.forEach(function(jobItem){

						if(jobItem.status === 'doing'){
							jobItem.status = 'error';
						}

					});
					break;
			}
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

		// 用于编译过程中标记各个Job的进度
		var jobProgress = [];
		$(window).trigger('gruntBridge.jobStart');

		var spawn = require('child_process').spawn,
		    grunt  = spawn('grunt',[taskName],{
		    	cwd:gruntBridge.basePath
		    });

		// 捕获标准输出
		grunt.stdout.on('data', function(output){
			helper.parseOutput(output,jobProgress);
			$(window).trigger('gruntBridge.jobProgress',[jobProgress]);
		});

		// 捕获标准错误输出并将其打印到控制台
		grunt.stderr.on('data', function (data) {
		    console.log('标准错误输出：\n' + data);
		});

		// 注册子进程关闭事件
		grunt.on('exit', function (code, signal) {
		    helper.parseExit(code,jobProgress);
			$(window).trigger('gruntBridge.jobProgress',[jobProgress]);
			$(window).trigger('gruntBridge.exit');
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
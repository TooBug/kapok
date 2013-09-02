~function(window){

	var kapok = {};

	kapok.initConfig = function(gruntPath){

		gruntBridge.basePath = gruntPath;
		gruntBridge.getConfig();
		
	};

	kapok.initTask = function(taskName){

		var targetTaskList = gruntBridge.config.buildTaskList.filter(function(buildTask){
			return buildTask.name === taskName;
		});

		var targetTask;

		if(!targetTaskList || !targetTaskList.length){
			return false;
		}

		targetTask = targetTaskList[0];
		ui.main.updateTaskName(targetTask.name);
		ui.main.updateTaskList(gruntBridge.config.buildTaskList,targetTask.name);
		ui.main.fillJobList(targetTask.jobList);

	};

	kapok.doCompile = function(taskName){

		var targetTaskList = gruntBridge.config.buildTaskList.filter(function(buildTask){
			return buildTask.name === taskName;
		});

		var targetTask;

		if(!targetTaskList || !targetTaskList.length){
			return false;
		}

		gruntBridge.doCompile(taskName);

	};

	kapok.test = function(){

		// kapok.initConfig('../other/test/');
		kapok.initConfig('/Users/TooBug/work/prowork/');
		console.log(gruntBridge.config);
		kapok.initTask('pcall');

	};

	window.kapok = kapok;

}(window);

$(function(){

	// 绑定任务切换事件
	ui.event.bindTaskSwitch(kapok.initTask);

	// 绑定开始编译按钮事件
	ui.event.bindCompile(kapok.doCompile);

	kapok.test();
	
});

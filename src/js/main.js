/* global gruntBridge,ui,$*/
~function(window){

	'use strict';

	var kapok = {};

	kapok.initConfig = function(projectPath,gruntfilePath){

		gruntBridge.basePath = projectPath;
		if(gruntfilePath){
			gruntBridge.gruntfilePath = gruntfilePath;
		}else{
			gruntBridge.gruntfilePath = projectPath;
		}
		gruntBridge.getConfig();
		ui.main.updateProjectName(gruntBridge.config.package.name,gruntBridge.config.package.version);
		
	};

	kapok.initTask = function(taskName){

		var targetTaskList;

		if(taskName){		
			targetTaskList = gruntBridge.config.buildTaskList.filter(function(buildTask){
				return buildTask.name === taskName;
			});
		}else{
			targetTaskList = gruntBridge.config.buildTaskList.slice(0,1);
		}

		if(!targetTaskList || !targetTaskList.length){
			return false;
		}

		var targetTask = targetTaskList[0];
		// ui.main.updateTaskList(gruntBridge.config.buildTaskList,targetTask.name);
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

	kapok.init = function(){

		// kapok.initConfig('../other/test/');
		// kapok.initConfig('/Users/TooBug/work/prowork/');
		kapok.initConfig(localStorage.getItem('basePath'),localStorage.getItem('gruntfilePath'));
		// console.log(gruntBridge.config);
		kapok.initTask();

	};

	window.kapok = kapok;

}(window);

$(function(){

	// 绑定任务切换事件
	ui.event.bindTaskSwitch(kapok.initTask);

	// 绑定开始编译按钮事件
	ui.event.bindCompile(kapok.doCompile);

	// 绑定gruntBridge事件
	var $window = $(window);

	$window.on('gruntBridge.jobProgress',function(e,progress){

		progress.forEach(function(jobProgress){

			ui.main.updateJobProgress(jobProgress.name,jobProgress);

		});

	});

	$window.on('gruntBridge.exit',function(){
		showDialog({
			content:'构建完成！',
			canCancel:false
		}).done(function($dialog){
			ui.main.enableCompileBtn()
			$dialog.remove();
		});
	});

	$window.on('gruntBridge.jobStart',function(){

		ui.main.clearAllJobProgress();

	});

	kapok.init();
	
});

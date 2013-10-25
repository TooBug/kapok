/* global gruntBridge,ui,$*/
~function(window){

	'use strict';

	var kapok = {};

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

	// 初始化
	kapok.init = function(){
		
		gruntBridge.initConfig(localStorage.getItem('basePath'),localStorage.getItem('gruntfilePath'));

		ui.main.updateProjectName(gruntBridge.config.package.name,gruntBridge.config.package.version);
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

	$window.on('gruntBridge.exit',function(e,jobProgress){

		var content,hasError = false;

		/*jobProgress.forEach(function(jobItem){

			if(jobItem.status === 'error'){
				hasError = true;
			}

		});*/

		content = hasError?'构建错误！':'构建完成！';

		showDialog({
			content:content,
			canCancel:false
		}).done(function($dialog){
			ui.main.enableCompileBtn()
			$dialog.remove();
		});
	});

	$window.on('gruntBridge.error',function(e,msg){
		showDialog({
			content:'构建出错：' + msg,
			canCancel:false
		}).done(function($dialog){
			ui.main.enableCompileBtn()
			$dialog.remove();
		});
	});

	$window.on('gruntBridge.jobStart',function(){

		ui.main.clearAllJobProgress();

	});

	var gui = require('nw.gui');
	var win = gui.Window.get();

	win.on('closed',function(){

		gruntBridge._gruntProcess.kill();

	});

	kapok.init();
	
});

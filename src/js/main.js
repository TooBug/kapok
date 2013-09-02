~function(window){

	var kapok = {};

	kapok.initConfig = function(gruntPath){

		gruntBridge.basePath = gruntPath;
		gruntBridge.getConfig();
		
	}

	kapok.initTask = function(taskName){

		var targetTaskList = gruntBridge.config.buildTaskList.filter(function(buildTask){
			return buildTask.name === taskName;
		});

		var targetTask;

		if(targetTaskList && targetTaskList.length){
			targetTask = targetTaskList[0];
		}

		ui.main.updateTaskName(targetTask.name);
		ui.main.updateTaskList(gruntBridge.config.buildTaskList,targetTask.name);
		ui.main.fillJobList(targetTask.jobList);

	}

	kapok.test = function(){

		kapok.initConfig('../other/test/');
		console.log(gruntBridge.config);
		kapok.initTask('pcall');

	}


	window.kapok = kapok;

}(window);

$(function(){

	kapok.test();
	
});

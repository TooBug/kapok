~function(window){

	var jobSettings = {};

	jobSettings.config = {};

	jobSettings.parseJobData = function(jobInfo){

		if(Array.isArray(jobInfo)){

			jobSettings.config.fileList = jobInfo;

		}

	}

	window.jobSettings = jobSettings;

}(window);

$(function(){

	console.log(jobInfo);

	jobSettings.parseJobData(jobInfo);

	ui.jobSettings.fillFileList(jobSettings.config.fileList);

});

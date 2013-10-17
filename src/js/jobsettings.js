~function(window){

	var path = require('path');

	var jobSettings = {};

	jobSettings.config = {};

	jobSettings.parseJobData = function(jobNameArr,jobInfo){

		jobSettings.config.hasOutput = true;

		if(Array.isArray(jobInfo)){
			// 数组，适用于jshint

			jobSettings.config.sourceFileList = jobInfo;
			jobSettings.config.distFileList = [];
			jobSettings.config.sourceFileType = 'array';
			jobSettings.config.hasOutput = false;

		}else if(jobInfo.src && Array.isArray(jobInfo.src)){
			// 非数组，有src为数组的插件，适用于htmlhint/csshint/replace
			jobSettings.config.sourceFileList = jobInfo.src;
			jobSettings.config.sourceFileType = 'srcArray';
			
			// replace插件的覆盖当前文件选项
			if(jobInfo.overwrite){

				jobSettings.config.distFileList = jobInfo.src;

			}else{

				// 是否有目标地址
				if(jobInfo.dest){

					jobSettings.config.distFileList = jobSettings.config.sourceFileList.map(function(sourceFile){
						return path.join(jobInfo.dest,sourceFile);
					});

				}else{

					jobSettings.config.distFileList = [];
					jobSettings.config.hasOutput = false;

				}

			}

		}else if(jobInfo.files && !Array.isArray(jobInfo.files)){
			// 非数组，有files且files不为数组，即files为目标文件与源文件一一对应的映射

			var tmpSourceFileList = [];
			var tmpDistFileList = [];
			for(var fileItem in jobInfo.files){

				if(jobInfo.files.hasOwnProperty(fileItem)){

					var tmpArr = jobInfo.files[fileItem];

					if(!Array.isArray(tmpArr)){
						tmpArr = [tmpArr];
						jobSettings.config.sourceFileType = 'fileMap';
					}else{
						jobSettings.config.sourceFileType = 'arrayMap';
					}

					tmpArr.forEach(function(tmpItem){

						tmpSourceFileList.push(tmpItem);
						tmpDistFileList.push(fileItem);

					});
				}

			}
			jobSettings.config.sourceFileList = tmpSourceFileList;
			jobSettings.config.distFileList = tmpDistFileList;

		}else if(jobInfo.files && Array.isArray(jobInfo.files)){
			jobSettings.config.sourceFileType = 'fileGroup';
			// files为数组，一般为多组文件进行操作，可各自设置参数
			// 适用于copy
			jobInfo.files.forEach(function(fileGroup){

				jobSettings.config.sourceFileList = (jobSettings.config.sourceFileList || []).concat(fileGroup.src);
			
				// 是否有目标地址
				if(fileGroup.dest){

					jobSettings.config.distFileList = (jobSettings.config.distFileList || []).concat(jobSettings.config.sourceFileList.map(function(sourceFile){
						return path.join(fileGroup.dest,sourceFile);
					}));

				}else{

					jobSettings.config.distFileList = [];
					jobSettings.config.hasOutput = false;

				}

			});
		}

	}

	window.jobSettings = jobSettings;

}(window);

$(function(){

	jobSettings.parseJobData(jobNameArr,jobInfo);

	ui.jobSettings.fillSourceFileList(jobSettings.config.sourceFileList);
	ui.jobSettings.fillDistFileList(jobSettings.config.distFileList);

});

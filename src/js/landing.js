/* global jQuery,showDialog,ui */

(function($){

'use strict';

$('#projectFolder').click(function(e){

	var ipc = require('ipc');
	var folderPath = ipc.sendSync('dialog', 'folderPath');

	if(!folderPath.length){
		return false;
	}else{
		folderPath = folderPath[0];
	}

	var path = require('path');
	var fs = require('fs');

	var packageJsonPath = '';
	var gruntfilePath = '';

	var packageJsonPaths = ['package.json','.kapok/package.json'];
	var gruntfilePaths = ['Gruntfile.js','.kapok/Gruntfile.js'];

	packageJsonPaths.forEach(function(lookUpPath){
		if(fs.existsSync(path.join(folderPath,lookUpPath))){
			packageJsonPath = path.dirname(lookUpPath);
		}
	});

	gruntfilePaths.forEach(function(lookUpPath){
		if(fs.existsSync(path.join(folderPath,lookUpPath))){
			gruntfilePath = path.dirname(lookUpPath);
		}
	});

	localStorage.setItem('basePath',folderPath + path.sep);

	if(packageJsonPath && gruntfilePath && packageJsonPath === gruntfilePath){
		localStorage.setItem('gruntfilePath',gruntfilePath);
		location.href = './main.html';
	}else{
		showDialog({
			content:'项目目录未找到Grunt构建文件，是否要生成构建方案？'
		}).done(function($dialog){
			localStorage.setItem('gruntfilePath','.kapok');
			location.href = './taskmarket.html';
		}).fail(function($dialog){
			$dialog.remove();
		});
	}

});

// 最近项目
var recentProjects = JSON.parse(localStorage.getItem('recentProjects') || '[]');
recentProjects.unshift({'name':'选择最近项目'});

ui.landing.setRecentProjects(recentProjects);
ui.event.bindRecentProjectSwitch(function(value){

	if(value){
		var targetProject = recentProjects.filter(function(project){
			return project.name === value;
		});

		localStorage.setItem('basePath',targetProject[0].basePath);
		localStorage.setItem('gruntfilePath',targetProject[0].gruntfilePath);
		location.href = './main.html';
	}

});

})(jQuery);

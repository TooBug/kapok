~function(window,$){

	'use strict';

	// var path = require('path');

	var ui = {};

	ui.main = {};

	/* 主页面UI操作 */
	ui.main.updateJobProgress = function(jobName,progressObj){

		$('#jobList li[data-jobname="' + jobName + '"]').removeClass('waiting doing done')
			.addClass(progressObj.status === 'done'?'done':'doing');
	};

	ui.main.clearAllJobProgress = function(jobName,progressObj){

		$('#jobList li').removeClass('doing done').addClass('waiting')
			.find('.title')
			.css('background-size','0 100%');

	};

	ui.main.fillJobList = function(jobList){

		var jobArr = jobList.map(function(jobItem){
			return {
				jobName:jobItem
			}
		});

		var jobHtml = MicroTmpl(document.querySelector('#tmpl_jobListItem').innerHTML,jobArr);
		$('#jobList').empty().append(jobHtml);

	};

	ui.main.updateProjectName = function(projectName,projectVersion){

		$('header span').text(projectName + '(' + projectVersion + ')');

	};

	ui.main.updateTaskList = function($container,taskList,currTaskName){

		var taskHtml = MicroTmpl('<p><label><input type="radio" value="{%name%}" name="targetTask" /> {%name%}</label></p>',taskList);

		$container.empty().append(taskHtml);

		if(currTaskName){
			$container.find('[value='+currTaskName+']').prop('checked',true);
		}

	};

	ui.main.enableCompileBtn = function(){

		// $('#operate button[type=submit]').prop('disabled',false);
		$('#operate button[type=submit]').text('开始编译');

	};

	/* landingUI操作 */
	ui.landing = {};
	ui.landing.setRecentProjects = function(recentProjects){

		var projectsHtml = MicroTmpl('<option value="{%name%}">{%name%}</option>',recentProjects);
		$('#landing_container .btn_more').html(projectsHtml);

	};

	/* Job设置页UI操作 */

	ui.jobSettings = {};

	ui.jobSettings.fillSourceFileList = function(fileList){


		var jobHtml = '';

		fileList.forEach(function(fileItem){

			jobHtml += MicroTmpl(document.querySelector('#tmpl_sourceFileListItem').innerHTML,{
				// filePath:path.relative(basePath,fileItem)
				filePath:fileItem
			});

		});

		$('#sourceFileList').empty().append(jobHtml);

	};

	ui.jobSettings.fillDistFileList = function(fileList){


		var jobHtml = '';

		fileList.forEach(function(fileItem){

			jobHtml += MicroTmpl(document.querySelector('#tmpl_distFileListItem').innerHTML,{
				// filePath:path.relative(basePath,fileItem)
				filePath:fileItem
			});

		});

		$('#distFileList').empty().append(jobHtml);

	};

	// 事件绑定

	ui.event = {};

	ui.event.bindTaskSwitch = function(callback){

		$('#operate button[type=button]').click(function(){

			showDialog({

				content:'',
				onShow:function($dialog){
					ui.main.updateTaskList($dialog.find('.bd'),gruntBridge.config.buildTaskList);
				}

			}).done(function($dialog){

				ui.currTaskName = $dialog.find('input[name="targetTask"]:checked').val();
				callback(ui.currTaskName);
				$dialog.remove();

			}).fail(function($dialog){
				$dialog.remove();
			});


		});

	};

	ui.event.bindCompile = function(callback){

		$('#operate button[type=submit]').click(function(e){

			var $this = $(this);
			if(!$this.data('status') || $this.data('status') === 'stopped'){

				if(!ui.currTaskName){
					ui.currTaskName = gruntBridge.config.buildTaskList[0].name;
				}

				// $(this).prop('disabled',true);
				$(this).text('中止构建').data('status','doing');
				callback(ui.currTaskName);

				e.stopImmediatePropagation();
				
			}

		});

	};

	ui.event.bindStopCompile = function(callback){

		$('#operate button[type=submit]').click(function(){

			var $this = $(this);
			if($this.data('status') === 'doing'){

				callback();
				$(this).html('<span class="icon icon_tool"></span> 开始构建').data('status','stopped');
				
			}

		});

	};

	ui.event.bindRecentProjectSwitch = function(callback){

		$('#landing_container .btn_more').change(function(){
			callback($(this).val());
		});

	};


	window.ui = ui;


	// 基本UI功能
	$(function(){

		var gui = require('nw.gui');
		var nativeWindow = gui.Window.get();

		$('header').on('click','.close_btn,.max_btn,.min_btn',function(){

			var $this = $(this);

			if($this.hasClass('close_btn')){

				var content = '确认要关闭kapok么？';

				// 主页面退出时提供清理构建文件的选项
				if(location.href.indexOf('main.html') > -1){
					content += '<p class="checkList"><input type="checkbox" id="cleanKapokFiles" /><label for="cleanKapokFiles">（安全）清理构建使用的文件</label></p>';
				}

				showDialog({
					content:content
				}).done(function($dialog){
					if($dialog.find('#cleanKapokFiles:checked').length){

						kapok.removeBuildingFiles();

					}
					gui.App.quit();
				}).fail(function($dialog){
					$dialog.remove();
				})

			}else if($this.hasClass('min_btn')){
				nativeWindow.minimize();
			}

		});

		// 编辑具体的编译Job
		/*$('#jobList').on('click','li',function(){

			var $this = $(this);
			var targetJobName = $this.data('jobname');
			var targetJobNameArr = targetJobName.split(':');
			var jobInfo;

			var jobSettingsWindow = gui.Window.get(window.open('./jobsettings.html'));
			// jobSettingsWindow.resizeTo(400,300);

			for(var jobGroup in gruntBridge.config.jobs){

				if(jobGroup === targetJobNameArr[0]){

					for(var jobName in gruntBridge.config.jobs[jobGroup]){

						if(jobName === targetJobNameArr[1]){

							jobInfo = gruntBridge.config.jobs[jobGroup][jobName];

						}

					}

				}

			}

			jobSettingsWindow.window.basePath = gruntBridge.basePath;
			jobSettingsWindow.window.jobInfo = jobInfo;
			jobSettingsWindow.window.jobNameArr = targetJobNameArr;
			

		});*/


		// 设置页同步滚动
		$('#sourceFileList,#distFileList').on('scroll',function(e){

			var $this = $(this),
				$that = $('#sourceFileList,#distFileList').not($this);

			var thisHeight = $this.height(),
				thisWidth = $this.width(),
				thatHeight = $that.height(),
				thatWidth = $that.width();

			var heightPercent = $this.get(0).scrollTop / thisHeight,
				widthPercent = $this.get(0).scrollLeft /thisWidth;

			/*$that.get(0).scrollTop = heightPercent * thatHeight;
			$that.get(0).scrollLeft = widthPercent * thatWidth;*/
			$that.get(0).scrollTop = $this.get(0).scrollTop;
			$that.get(0).scrollLeft = $this.get(0).scrollLeft;

		});

		// 设置页同步hover
		$('#sourceFileList,#distFileList').on('mouseenter','li',function(e){

			var $this = $(this),
				$thisUl = $this.parent(),
				index = $thisUl.find('li').index($this),
				$that = $('#sourceFileList,#distFileList').not($thisUl).find('li:eq('+index+')');

			$('#sourceFileList li,#distFileList li').removeClass('hover');

			$that.addClass('hover');

		});


	});



}(window,jQuery);

/**
 * 微型模板引擎 https://github.com/TooooBug/MicroTmpl/
 * @param {String} tmpl 模板字符串
 * @param {Object} data 用于填充模板的数据
 */
function MicroTmpl(tmpl,data){
	var itemdata;
	function strReplace(match,itemName){
		return itemdata[itemName] || '';
	}
	if(typeof data.length === 'undefined'){
		itemdata = data;
		return tmpl.replace(/\{%(\w+)%\}/g,strReplace);
	}else{
		var ret = '';
		data.forEach(function(dataItem){
			itemdata = dataItem;
			ret += tmpl.replace(/\{%(\w+)%\}/g,strReplace);
		});
		return ret;
	}
}
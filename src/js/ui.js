~function(window,$){

	var ui = {};

	ui.main = {};

	ui.main.updateJobProgress = function(jobName,progressObj){

		$('#jobList li[data-jobname="' + jobName + '"]').removeClass('waiting doing done')
			.addClass(progressObj.status === 'done'?'done':'waiting')
			.find('.title')
			.css('background-size',progressObj.progress + '% 100%');

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

		$('#taskInfo .projectName').text(projectName + '(' + projectVersion + ')');

	};

	ui.main.updateTaskList = function(taskList,currTaskName){

		var jobHtml = MicroTmpl('<option value="{%name%}">{%name%}</option>',taskList);
		var $targetSelect = $('#taskInfo select');

		$targetSelect.empty().append(jobHtml);

		if(currTaskName){
			$targetSelect.val(currTaskName);
		}

	};

	// 事件绑定

	ui.event = {};

	ui.event.bindTaskSwitch = function(callback){

		$('#taskInfo select').change(function(){

			callback($(this).val());

		});

	};

	ui.event.bindCompile = function(callback){

		$('#operate button[type=submit]').click(function(){

			callback($('#taskInfo select').val());

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

				if(confirm('确认要关闭kapok么？')){
					gui.App.quit();
				}

			}else if($this.hasClass('min_btn')){
				nativeWindow.minimize();
			}

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
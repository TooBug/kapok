~function(window,$){

	var ui = {};

	ui.main = {};

	ui.main.updateJobProgress = function($dom,progress){

		$dom.find('.title').css('background-size',progress + '% 100%');

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

	ui.main.updateTaskName = function(taskName){

		$('#taskInfo .projectName').text(taskName);

	};

	ui.main.updateTaskList = function(taskList,currTaskName){

		var jobHtml = MicroTmpl('<option value="{%name%}">{%name%}</option>',taskList);
		var $targetSelect = $('#taskInfo select');

		$targetSelect.empty().append(jobHtml);

		if(currTaskName){
			$targetSelect.val(currTaskName);
		}

	};


	window.ui = ui;
	
}(window,window.jQuery);

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
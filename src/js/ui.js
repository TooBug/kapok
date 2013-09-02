~function(window,$){

	var ui = {};

	ui.main = {};

	ui.main.updateJobProgress = function($dom,progress){

		$dom.find('.title').css('background-size',progress + '% 100%');

	};


	window.ui = ui;
	
}(window,window.jQuery || window.tQuery);
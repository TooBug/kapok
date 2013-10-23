/* global jQuery */
(function($){

	$('#taskmarket_container').on('click','li',function(){

		$(this).toggleClass('selected');

	});

	$('#operate .confirm_tasks').click(function(){

		var taskList = $('#taskmarket_container li.selected').map(function(){
			return $(this).data('task');
		}).get();

		if(!taskList.length){
			showDialog({
				content:'请至少选择一个任务……吧？',
				canCancel:false
			}).done(function($dialog){
				$dialog.remove();
			})
			return false;
		}

		localStorage.setItem('market_tasks',JSON.stringify(taskList));

		if(taskList.length === 1 && taskList[0] === 'livereload'){
			location.href = "buildconfig.html";
		}

	});

})(jQuery);
/* global $*/
//对话框
(function(window){

	'use strict';

	/**
	 * 显示浮层
	 * @param {Object} options 参数
	 * @param {Number} options.width 浮层宽度
	 * @param {Boolean} options.withMask 是否显示遮罩
	 * @param {Boolean} options.canClose 是否允许“关闭”，默认和canCancel取值一样
	 * @param {Boolean} options.canCancel 是否允许“取消”
	 * @param {String} options.okBtnText 确定按钮的文字
	 * @param {String} options.cancelBtnText 取消按钮的文字
	 * @param {Function} onShow 显示浮层时的回调函数
	 * @param {Function} onOkClick 点击确定按钮时的回调函数，返回false时会阻止Deferred.resolve
	 * @param {Function} onCancelClick 点击取消时的回调函数，返回false时会阻止Deferred.reject
	 * @param {Function} onCloseClick 点击关闭时的回调函数，默认和onCancelClick一样
	 * @return {Object} jQuery的Deferred对象
	 */
	window.showDialog = function(options){

		var dfd = $.Deferred();
		
		var defaultOpt = {
				width:300,
				withMask:false,
				canClose:true,
				canCancel:true,
				okBtnText:'确定',
				cancelBtnText:'取消'
			},
			opt = $.extend({},defaultOpt,options),
			$dialogDom = $('<div class="dialog" style="width:' + opt.width + 'px">'+
							'<button class="close dialog_close_btn">关闭</button>'+
							'<div class="bd">'+ opt.content +
							'</div>'+
							'<div class="ctrl">'+
								'<button class="dialog_cancel_btn">' + opt.cancelBtnText + '</a>'+
								'<button class="dialog_ok_btn">' + opt.okBtnText + '</a>'+
							'</div>'+
						'</div>');

		opt.canClose = opt.canCancel;

		$dialogDom.appendTo(document.body);

		if(opt.withMask){
			
			this.$mask = this.$mask || $('<div class="ui_mask"></div>').appendTo(document.body);
			this.$mask.fadeIn();
		}
		
		if(!opt.canCancel){
			$dialogDom.find('.dialog_cancel_btn').remove();
		}

		if(!opt.canClose){
			$dialogDom.find('.dialog_close_btn').remove();
		}

		$dialogDom.find('.dialog_ok_btn').click(function(){

			var canClose = true;

			if(typeof opt.onOkClick === 'function'){

				canClose = opt.onOkClick($dialogDom);

			}

			if(typeof canClose === 'undefined' || canClose){
				dfd.resolve($dialogDom);
			}


			return false;

		});

		$dialogDom.find('.dialog_cancel_btn').click(function(){

			var canCancel = true;

			if(typeof opt.onCancelClick === 'function'){

				canCancel = opt.onCancelClick($dialogDom);

			}

			if(typeof canCancel === 'undefined' || canCancel){
				dfd.reject($dialogDom);
			}


			return false;

		});

		$dialogDom.find('.dialog_close_btn').click(function(){

			var canClose = true;
			var closeEqCancel = false;	//判断Close行为是否要行Cancel一致

			// 如果没指定onCloseClick，则Close行为和Cancel一致
			if(!opt.onCloseClick){
				opt.onCloseClick = opt.onCancelClick;
				closeEqCancel = true;
			}

			if(typeof opt.onCloseClick === 'function'){

				canClose = opt.onCloseClick($dialogDom);

			}

			if(closeEqCancel && (typeof canClose === 'undefined' || canClose)){
				dfd.reject($dialogDom);
			}


			return false;

		});

		if(typeof opt.onShow === 'function'){
			opt.onShow($dialogDom);
		}

		return dfd;
	};

})(window);
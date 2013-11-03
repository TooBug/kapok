/* global jQuery,showDialog,gruntBridge */
(function($){

	'use strict';

	$('#operate .build_config').click(function(){

		$('#operate .build_config').prop('disabled',true);

		writeLog('生成package.json……');

		gruntBridge.writePackageJson(['watch','open','connect']);

		writeLog('done<br />');
		writeLog('生成Gruntfile.js……');

		gruntBridge.writeGruntFile({

			livereload:{

				connect:{
					options:{
						port:13111,
						base:gruntBridge.basePath,
						livereload:true
					}
				},
				open:{
					path:'http://localhost:13111'
				},
				watch:{
					files:[
						gruntBridge.basePath + '**/*.html',
						gruntBridge.basePath + '**/*.css',
						gruntBridge.basePath + '**/*.js'
					],
					options:{
						livereload:true
					}
				}

			}

		});

		writeLog('done<br />');

		writeLog('写入配置缓存……');

		localStorage.setItem('gruntfilePath','.kapok');

		writeLog('done<br />');

		writeLog('初始化依赖库……');

		gruntBridge.initNpm(function(){

			showDialog({
				content:'配置成功！',
				canCancel:false
			}).done(function(){
				location.href = 'main.html';
			});

			writeLog('done<br />');
			

		},function(){
			
			showDialog({
				content:'依赖下载失败！请手工切换到' + gruntBridge.basePath + '.kapok目录并运行npm install安装依赖后使用！',
				canCancel:false
			}).done(function(){
				location.href = 'main.html';
			});

			writeLog('fail<br />');

		},function(eventType,data){

			var msg;

			switch(eventType){
				case 'proxyStart':
					msg = '检测代理……'
					break;
				case 'proxyEnd':
					if(data === 'noProxy'){
						msg = '无代理<br />';
					}else{
						msg = data + '<br />';
					}
					break;
				case 'npmInstallStart':
					msg = '开始下载：<br />';
					break;
				case 'npmInstallOutput':
					msg = data.replace(/\n/g,'<br />');
					break;
				case 'npmInstallError':
					msg = data + '<br />';
					break;
			}

			writeLog(msg);

		});



	});

	gruntBridge.initConfig(localStorage.getItem('basePath'),localStorage.getItem('gruntfilePath'),false);

	function writeLog(msg){
		$('p.log').append(msg);
	}

})(jQuery);
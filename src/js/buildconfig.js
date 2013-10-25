/* global jQuery,showDialog,gruntBridge */
(function($){

	'use strict';

	$('#operate .build_config').click(function(){

		gruntBridge.writePackageJson(['watch','open','connect']);

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

		showDialog({
			content:'配置生成成功！请手工切换到' + gruntBridge.basePath + '.kapok目录并运行npm install安装依赖后使用！',
			canCancel:false
		}).done(function(){
			location.href = 'main.html';
		});


	});

	gruntBridge.initConfig(localStorage.getItem('basePath'),localStorage.getItem('gruntfilePath'),false);

})(jQuery);
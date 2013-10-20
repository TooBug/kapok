/* global jQuery,showDialog */

(function($){

'use strict';

$('#projectFolder').change(function(e){

	var $this = $(this);

	var startTime = Date.now();

	var files = e.originalEvent.target.files;
	var folderRegExp = /^([^\/]+)\//;
	var folderPath;
	var folderMatch;

	if(!files || !files.length){
		return false;
	}

	folderMatch = files[0].webkitRelativePath.match(folderRegExp);

	if(!folderMatch || !folderMatch.length || folderMatch.length < 2){
		return false;
	}

	$this.prop('disabled',true)
			.closest('button').prop('disabled',true);

	folderPath = files[0].path.replace(files[0].webkitRelativePath,'') +
			folderMatch[1];

	setTimeout(function(){

		var hasPackageJson = false;
		var hasGruntFile = false;
		var fileList = {
			js:[],
			css:[],
			png:[],
			other:[]
		};
		var careExtList = ['js','css','png'];
		var excludeFileRegexp = /(?:\.svn|\.git|\.kapok|\.gitignore|\.DS_Store|\.localized|node_modules|thumbs\.db$|\.$|\.min\.js|\.min\.css)/;
		var extRegexp = /\.([^\.]+)$/;

		Array.prototype.forEach.call(files,function(file){

			var filePath = file.webkitRelativePath.replace(folderMatch[1]+'/','');
			var extMatch = filePath.match(extRegexp);
			var ext = '';

			if(filePath === 'package.json' ||
					filePath === '.build/package.json' ||
					filePath === '.kapok/package.json'){
				hasPackageJson = true;
			}

			if(filePath === 'Gruntfile.js' ||
					filePath === '.build/Gruntfile.js' ||
					filePath === '.kapok/Gruntfile.js'){
				hasGruntFile = true;
			}

			if(extMatch && extMatch.length && extMatch.length >= 2){
				ext = extMatch[1];
			}

			if(!excludeFileRegexp.test(filePath)){

				if(careExtList.indexOf(ext) > -1){
					fileList[ext].push(filePath);
				}else{
					fileList.other.push(filePath);
				}

			}

		});

		if(hasPackageJson && hasGruntFile){
			localStorage.setItem('basePath',folderPath + '/');
			location.href = './main.html';
		}else{
			showDialog({
				content:'项目目录未找到Grunt构建文件，无法继续。扫描生成构建方案的功能正在开发，敬请期待……',
				canCancel:false
			}).done(function($dialog){
				$dialog.remove();
				$this.prop('disabled',false)
						.closest('button').prop('disabled',false);
			});
		}

		$this.val('');

		// console.log('package.json',hasPackageJson,'Gruntfile.js',hasGruntFile);

		// console.log(fileList);

	},10000);


});



})(jQuery);

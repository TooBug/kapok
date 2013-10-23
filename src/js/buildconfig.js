/* global jQuery,showDialog */
(function($){

	'use strict';



	$('#operate .build_config').click(function(){

		gruntBridge.writePackageJson({
			"grunt-contrib-watch": "~0.5.3",
		    "grunt-contrib-connect": "~0.5.0",
			"grunt-open": "~0.2.2"
		});

	});

	gruntBridge.initConfig(localStorage.getItem('basePath'),localStorage.getItem('gruntfilePath'),false);

})(jQuery);
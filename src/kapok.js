var app = require('app');
var BrowserWindow = require('browser-window');

// require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin')
		app.quit();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 600,
		height: 450,
		'use-content-size':true
	});
	mainWindow.loadUrl('file://' + __dirname + '/landing.html');
	mainWindow.on('closed', function() {
		mainWindow = null;
	});

	// 开发环境打开调试工具
	if(!/app$/.test(__dirname)){
		mainWindow.openDevTools();
	}
});

var ipc = require('ipc');
ipc.on('dialog',function(event,arg) {
	if(arg === 'folderPath'){
		var dialog = require('dialog');
		event.returnValue = dialog.showOpenDialog({
			properties: ['openDirectory']
		});
	}
});

ipc.on('window',function(event,arg){
	if(arg === 'close'){
		console.log('enter close');
		mainWindow.close();
		event.returnValue = true;
	}
});

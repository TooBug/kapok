/*!
*
* tQuery
* https://github.com/TooooBug/tQuery
* 
* @Author TooBug 
* @Version 0.0.1
* @License MIT
*
**/

(function(window){

	'use strict';

	// 存储window.$以便后续可以用noConfict解救出来
	var _$ = window.$;
	var _tQuery = window.tQuery;

	/********************* Core Start *********************/

	var eventList = [];
	// var readyList = [];
	var isReady = false;

	if(document.readyState === 'complete'){
		isReady = true;
	}else{
		document.addEventListener('DOMContentLoaded',function(){
			isReady = true;
		},false);
	}

	// tQuery主函数，参数为选择器
	var tQuery = function(selector){

		// 如果不是以构造函数运行，则强制返回一个新实例
		// 即 tQuery() 等价于 new tQuery()
		if(!(this instanceof tQuery)){

			return new tQuery(selector);

		}

		var ifHTMLStrReg = /</;	// 用来判断选择器字符串是否是DOM字符串

		this.length = 0; // tQuery对象的length属性
		this._tQuery = true; // 用于标识是否tQuery对象

		// 处理selector的重载
		switch(typeof selector){

			// 字符串
			case 'string':

				if(ifHTMLStrReg.test(selector)){	// DOM字符串

					var domList = helper.parseDOM(selector);

					var tempObj = {

						length:domList.length

					};

					tQuery.extend(tempObj,domList);
					tQuery.extend(this,tempObj);

				}else{	// 选择器

					tQuery.extend(this,document.querySelectorAll(selector));
					this.selector = selector;

				}

			// DOM列表
			case 'object':

				if(selector.type === 'NodeList'){	// 自定义的NodeList对象

					var tempObj = {

						length:selector.length

					};

					selector.nodeList.forEach(function(node,index){

						tempObj[index] = node;

					});

					tQuery.extend(this,tempObj);

				}else if(helper.isDomList(selector)){	// DOM NodeList

					tQuery.extend(this,selector);

				}else if(helper.isDomNode(selector) || selector === window){	// DOM节点或者window

					tQuery.extend(this,{
						'0':selector,
						length:1
					});

				}else if(helper.isPlainObject(selector)){	// 普通对象

					tQuery.extend(this,{
						'0':selector,
						length:1
					});

				}else if(helper.isArray(selector)){	// 数组

					var tempObj = {

						length:selector.length

					}

					selector.forEach(function(arrElement,index){

						tempObj[index] = arrElement;

					});

					tQuery.extend(this,tempObj);

				}

				break;

			// DOM Ready
			case 'function':

				tQuery().ready(selector);

				break;

		}

	};

	/********************** Core End **********************/


	/****************** Core Method Start *****************/

	// 复制对象属性
	// isDeep可选，target之后可以跟无限多个被复制属性的对象
	tQuery.extend = function(isDeep,target){

		var sources = [];

		if(helper.isBoolean(isDeep)){	// isDeep有值

			sources = Array.prototype.slice.call(arguments,2);

		}else{	// 省略isDeep

			target = isDeep;
			isDeep = false;
			sources = Array.prototype.slice.call(arguments,1);

		}

		// 如果没有source，则将唯一的对象复制到tQuery对象上
		if(sources.length === 0){

			sources.push(target);
			target = this;

		}

		sources.forEach(function(source){

			copyProperty(target,source,isDeep);

		});

		// 复制对象属性实现
		function copyProperty(target,source,isDeep){

			if(helper.isArray(source)){

				source.forEach(function(sourceElement){

					if(isDeep &&
							(helper.isArray(sourceElement) || 
							helper.isPlainObject(sourceElement))){

						var tempObj = {};
						copyProperty(tempObj,sourceElement,isDeep);
						target.push(sourceElement);

					}


					target.push(sourceElement);

				});


			}else if(helper.isPlainObject(source)){

				var keys = Object.keys(source);

				keys.forEach(function(key){

					if(isDeep && helper.isArray(source[key])){	// 数组

						if(!target[key]){
							target[key] = [];
						}

						copyProperty(target[key],source[key],isDeep);

					}else if( isDeep & helper.isPlainObject(source[key])){ // 对象

						if(!target[key]){
							target[key] = {};
						}

						copyProperty(target[key],source[key],isDeep);

					}else{	// 否则直接复制属性

						target[key] = source[key];

					}

				});

			}

		}


	};

	// Deferred对象
	tQuery.Deferred = function(){

		if(!(this instanceof tQuery.Deferred)){
			return new tQuery.Deferred();
		}

		this._status = 'pending';
		this._doneCallback;
		this._failCallback;
		this._alwaysCallback;
		this._thenCallback;

		this.constructor = tQuery.Deferred;

		return this;

	};

	tQuery.Deferred.prototype = {

		resolve:function(data){
			if(this._status !== 'pending') return;
			this._status = 'resolved';
			if(!helper.isArray(data)){
				data = [data];
			}
			this._doneCallback && this._doneCallback.apply(null,data);
			this._alwaysCallback && this._alwaysCallback.apply(null,data);
		},
		reject:function(err){
			if(this._status !== 'pending') return;
			this._status = 'rejected';
			this._failCallback && this._failCallback(err);
			this._alwaysCallback && this._alwaysCallback(err);
		},
		done:function(callback){
			this._doneCallback = callback;
			return this;
		},
		fail:function(callback){
			this._failCallback = callback;
			return this;
		},
		always:function(callback){
			this._alwaysCallback = callback;
			return this;
		},
		promise:function(){
			return this;
		},
		//TODO：.then需要改造以返回一个新的Deferred对象
		then:function(doneCallback,failCallback){
			this._doneCallback = doneCallback;
			this._failCallback = failCallback;
			return this;
		},
		_tQueryDeferred:1

	};

	// 开始异步方法，返回Deferred对象
	// TODO：.when方法需要处理.fail回调
	tQuery.when = function(){

		var dfd = tQuery.Deferred();
		var resultList = [];
		var resultCount = 0;
		var whenArguments = arguments;
		var fillResult = function(index,result){

			resultList[index] = result;

			resultCount++;

			if(resultCount === whenArguments.length){

				dfd.resolve(resultList);

			}

		};

		Array.prototype.forEach.call(arguments,function(argument,index){

			var tempResult;

			if(typeof argument !== 'function'){

				setTimeout(function(){
					fillResult(index,argument);
				},0);

			}else{

				tempResult = argument();
				if(tempResult && tempResult._tQueryDeferred){

					tempResult.done(function(result){

						fillResult(index,result);

					}).fail(function(err){

						fillResult(index,new Error(err));

					});

				}else{
					setTimeout(function(){
						fillResult(index,tempResult);
					},0);
				}

			}

		});

		return dfd;
	};

	// tQuery对象中的DOM遍历
	tQuery.each = function(domList,callback){

		if(helper.isPlainObject(domList)){	// 纯对象，则遍历key和value传递给callback

			for(var key in domList){

				if(domList.hasOwnProperty(key)){

					callback.call(domList[key],key,domList[key]);

				}

			}

		}else{	// 否则，像数组一样遍历

			Array.prototype.forEach.call(domList,function(domItem,index){

				callback.call(domItem,index,domItem);

			});	

		}


		return domList;

	};

	// 解析JSON
	tQuery.parseJSON = function(jsonStr){

		return JSON.parse(jsonStr);

	};

	// 当前时间
	tQuery.now = function(){

		return Date.now();

	};

	// 空方法
	tQuery.noop = function(){};

	// 释放$变量
	tQuery.noConflict = function(releasetQuery){

		window.$ = _$;
		if(releasetQuery){
			window.tQuery = _tQuery;
		}

	};
	
	// tQuery原型中的each方法
	tQuery.prototype.each = function(callback){

		return tQuery.each(this,callback);

	};

	// DOM Ready
	tQuery.prototype.ready = function(func){

		if((typeof this[0] !== 'undefined' && this[0] !== document) || !helper.isFunction(func)){
			return this;
		}

		if(isReady){
			func(tQuery);
		}else{
			document.addEventListener('DOMContentLoaded',function(){
				func(tQuery);
			},false);
		}

		return this;

	};

	/******************* Core Method End ******************/


	/********************** DOM Start *********************/

	// 获取原生对象，如果index为空则返回DOM数组
	tQuery.prototype.get = function(index){

		var index = parseInt(index,10);

		if(helper.isNumber(index)){

			if(index >= 0){

				return this[index];

			}else{

				return this[this.length + index];

			}

		}else{

			return Array.prototype.map.call(this,function(domItem){

				return domItem;

			});

		}

	};

	// 在现有对象中加入新的DOM
	tQuery.prototype.add = function(obj){

		if(!obj.length){
			if(helper.isDomNode(obj)){
				this[this.length] = obj;
				this.length++;
			}else{
				return this;
			}
		}
			
		for(var i=i;i<obj.length;i++){

			this[this.length] = obj[i];
			this.length++;

		}

		return this;

	};

	// 获取父元素
	tQuery.prototype.parent = function(selector){

		var parentSet = {

			type:'NodeList',
			nodeList:[],
			length:0

		};

		var allSelectorDom = document.querySelectorAll(selector);

		this.each(function(){

			if(this.parentNode &&
					Array.prototype.indexOf.call(parentSet.nodeList,this.parentNode) === -1 &&
					(!selector || Array.prototype.indexOf.call(allSelectorDom,this.parentNode) !== -1)){

				parentSet.nodeList.push(this.parentNode);
				parentSet.length ++;

			}


		});

		return tQuery(parentSet);

	};

	// 获取所有的父（祖先）元素
	tQuery.prototype.parents = function(selector){

		var parentSet = {

			type:'NodeList',
			nodeList:[],
			length:0

		};

		var allSelectorDom = document.querySelectorAll(selector);

		this.each(function(){

			var currdom = this.parentNode;

			while(currdom){

				if(Array.prototype.indexOf.call(parentSet.nodeList,currdom) === -1 &&
						(!selector || Array.prototype.indexOf.call(allSelectorDom,currdom) !== -1)){

					parentSet.nodeList.push(currdom);
					parentSet.length ++;
				}

				currdom = currdom.parentNode;

			}


		});

		return tQuery(parentSet);

	};

	// 获取或者改写DOM的HTML
	tQuery.prototype.html = function(htmlStr){

		if(typeof htmlStr === 'undefined'){

			return this[0].innerHTML;

		}else{

			this.each(function(){
				this.innerHTML = htmlStr;
			})
			return this;

		}

	};

	// 获取或者改写DOM的Text
	tQuery.prototype.text = function(textStr){

		if(typeof textStr === 'undefined'){

			return this[0].innerText;

		}else{

			this.each(function(){
				this.innerText = textStr;
			})
			return this;

		}

	};

	// 显示DOM
	tQuery.prototype.show = function(){

		return this.each(function(){

			this.style.display = '';

		});

	};

	// 隐藏DOM
	tQuery.prototype.hide = function(){

		return this.each(function(){

			this.style.display = 'none';

		});

	};

	// 获取（写入）DOM的property
	tQuery.prototype.prop = function(key,val){

		var propMap;
		if(helper.isPlainObject(key)){
			propMap = key;
		}
		if(!propMap && typeof val === 'undefined'){
			return this[0][key];
		}else{

			var target = this;

			if(!propMap){
				propMap = {}
				propMap[key] = val;
			}

			tQuery.each(propMap,function(key,val){

				target[0][key] = val;

			});

			return this;
		}

	};

	// 获取（写入）DOM的attribute
	tQuery.prototype.attr = function(key,val){

		var attrMap;
		if(helper.isPlainObject(key)){
			attrMap = key;
		}
		if(!attrMap && typeof val === 'undefined'){
			return this[0].getAttribute(key);
		}else{

			var target = this;

			if(!attrMap){
				attrMap = {};
				attrMap[key] = val;
			}

			tQuery.each(attrMap,function(key,val){

				target[0].setAttribute(key,val);

			});

			return this;
		}

	};

	// 将DOM（source）插入this
	tQuery.prototype.append = function(source){

		if(!helper.istQueryObject(source)){
			source = tQuery(source);
		}

		this.each(function(){

			var container = this;

			source.each(function(){
				container.appendChild(this);
			})

		});

		return this;

	};

	// 将DOM（source）插入this，位于所有子元素之前
	tQuery.prototype.prepend = function(source){

		if(!helper.istQueryObject(source)){
			source = tQuery(source);
		}

		this.each(function(){

			var container = this;
			var containerChildren = container.childNodes;
			var target;	//原来的第一个子元素

			if(containerChildren.length){
				target = container.firstChild;
			}

			source.each(function(){
				if(target){
					container.insertBefore(this,target);
				}else{
					container.appendChild(this);
				}
			})

		});

		return this;

	};

	/*********************** DOM End **********************/

	/********************** CSS Start *********************/

	// 是否含有指定的class名
	tQuery.prototype.hasClass = function(className){

		var classList = className.replace(/\./g,'').split(' ');
		var target = this[0];
		var ret = true;

		classList.forEach(function(className){

			if(!target.classList.contains(className.replace(/\./g,''))){
				ret = false;
			}

		});

		return ret;

	};

	// 添加class名
	tQuery.prototype.addClass = function(className){

		var classList = className.replace(/\./g,'').split(' ');

		this[0].classList.add.apply(this[0].classList,classList);

		return this;

	};

	// 移除class名
	tQuery.prototype.removeClass = function(className){

		var classList = className.replace(/\./g,'').split(' ');

		this[0].classList.remove.apply(this[0].classList,classList);

		return this;

	};

	// 切换指定的class名
	tQuery.prototype.toggleClass = function(className,addOrRemove){

		var classList = className.replace(/\./g,'').split(' ');

		if(typeof addOrRemove === 'undefined'){
			var target = this[0];
			classList.forEach(function(className){
				target.classList.toggle(className);
			});
		}else{
			if(addOrRemove){
				this.addClass(className);
			}else{
				this.removeClass(className);
			}
		}

		return this;

	};

	// 获取（设置）元素指定的CSS
	tQuery.prototype.css = function(key,val){

		var replaceKey = function(string){

			return string.replace(/-([a-z])/g,function(string,char){
				return char.toUpperCase();
			})

		};

		var styleMap;
		if(helper.isPlainObject(key)){
			styleMap = key;
		}
		if(!styleMap && typeof val === 'undefined'){
			return this[0].style[replaceKey(key)];
		}else{

			var target = this;

			if(!styleMap){
				styleMap = {}
				styleMap[key] = val;
			}

			tQuery.each(styleMap,function(key,val){

				target[0].style[replaceKey(key)] = val;

			});

			return this;
		}
	};

	// TODO:获取（设置）元素的宽度
	tQuery.prototype.width = function(){

	};

	// TODO:获取（设置）元素的宽度
	tQuery.prototype.height = function(){

	};

	/*********************** CSS End **********************/

	/********************* Event Start ********************/

	// 绑定事件
	tQuery.prototype.on = function(events,selector,data,handler){

		if(helper.isPlainObject(events)){

			for(var event in events){

				this.on(event,selector,data,handler);

			}

			return this;

		}


		var eventArr = events.split(' ');

		if(typeof handler === 'undefined'){

			if(helper.isString(selector)){

				// on(events,selector,handler)
				handler = data;
				data = undefined;

			}else if(helper.isFunction(data)){

				// on(events,data,handler)
				handler = data;
				data = selector;
				selector = undefined;

			}else{

				// on(events,handler)
				handler = selector;
				data = selector = undefined;

			}

		}


		// 绑定事件
		this.each(function(){

			var dom = this;

			eventArr.forEach(function(eventItem){

				// 事件类型可以加命名空间，比如click.login
				// 然后off时直接加上命名空间，可以不影响其它click事件
				var namespaceArr = eventItem.split('.');

				dom.addEventListener(namespaceArr[0],function(e){

					var eventObj = {

						type:e.type,
						preventDefault:e.preventDefault,
						stopPropagation:e.stopPropagation,
						target:e.target,
						data:data,
						originalEvent:e

					};

					var thisDom = dom;

					if(selector){

						// 检查是否符合代理的条件
						var delegatedDomList = thisDom.querySelectorAll(selector);

						if(!delegatedDomList.length) return;

						Array.prototype.forEach.call(delegatedDomList,function(delegatedDomItem){

							var allParentNodes = tQuery(e.target).parents().add(e.target);
							if(Array.prototype.indexOf.call(allParentNodes,delegatedDomItem) !== -1){

								thisDom = delegatedDomItem;

							}

						});

					}

					var returnValue = handler.call(thisDom,eventObj);

					if(returnValue === false){

						e.preventDefault();
						e.stopPropagation();

					}

				},false);

				eventList.push({

					dom:dom,
					handler:handler,
					namespace:namespaceArr.slice(1)

				});

			});			

		});


	};

	// TODO：取消绑定事件
	tQuery.prototype.off = function(events,selector,handler){

	};

	/********************** Event End *********************/
	
	
	/********************* Ajax Start *********************/

	// TODO:AJAX入口
	tQuery.prototype.ajax = function(url,options){

	};

	// TODO:get快捷入口
	tQuery.prototype.get = function(url,options){

	};
	
	/********************** Ajax End *********************/


	/********************* Helper Start *******************/

	// 辅助方法，私有
	var helper = {};

	// 是否是布尔值
	helper.isBoolean = function(target){

		return typeof target === 'boolean';

	};

	// 是否是字符串
	helper.isString = function(target){

		return typeof target === 'string';

	};

	// 是否是数字
	helper.isNumber = function(target){

		return !isNaN(target);

	};

	// 是否是数组
	helper.isArray = function(target){

		return Array.isArray(target);

	};

	// 是否是函数
	helper.isFunction = function(target){

		return typeof target === 'function';

	};

	// 是否是tQuery对象
	helper.istQueryObject = function(target){

		return target._tQuery;

	};

	// 是否是对象（非tQuery对象）
	helper.isPlainObject = function(target){

		return typeof target === 'object' &&
				!helper.isArray(target) &&
				!helper.istQueryObject(target);

	};

	// 是否是DOM节点
	helper.isDomNode = function(target){

		var ifHTMLElementReg = /Element$/;	// 判断一个对象是否是DOM节点
		return ifHTMLElementReg.test(target.constructor.name);

	};

	// 是否是DOM节点列表
	helper.isDomList = function(target){

		return target.constructor.name === 'NodeList';

	};

	// 解析DOM字符串
	helper.parseDOM = function(htmlStr){

		var tempDOM = document.createElement('div');
		tempDOM.innerHTML = htmlStr;
		return tempDOM.childNodes;

	};

	/******************* Helper end ******************/

	// 设置原型
	tQuery.fn = tQuery.prototype;

	window.tQuery = window.$ = tQuery;

	
})(window);
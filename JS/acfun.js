// ==UserScript==
// @name         Acfun Ad Helper
// @namespace    http://tampermonkey.net/
// @icon         https://tx-free-imgs.acfun.cn/content/2020_4_5/1.5860178587515075E9.png
// @version      0.23
// @description  移动暂停广告并缩小至右下角，点击×关闭后不再显示
// @author       zyl315
// @match        *://www.acfun.cn/v/*
// @exclude      *://www.acfun.cn/v/list**
// @match        *://www.acfun.cn/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
	var css = '.pause-display{display:none !important;}';    // 视频暂停广告
    css += '';
    loadStyle(css);

    // 等待视频下方工具条加载完成，网页全屏显示，自动选择最高画质
    waitElement('div.fullscreen-web').then(function(){
			$("div.fullscreen-web").click();
            $('div.quality-panel li[data-index="0"]').click()
		});

    // 设置内部样式
   function loadStyle(css) {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      style.appendChild(document.createTextNode(css));
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(style);
   }

    	// 等待元素加载成功或取消的函数
	function waitElement(selector, times, interval, flag=true){
        var _times = times || -1, // 默认不限次数
            _interval = interval || 500, // 默认每次间隔500毫秒
            _selector = selector, //选择器
            _iIntervalID,
            _flag = flag; //定时器id
        return new Promise(function(resolve, reject){
            _iIntervalID = setInterval(function() {
                if(!_times) { //是0就退出
                    clearInterval(_iIntervalID);
                    reject();
                }
                _times <= 0 || _times--; //如果是正数就 --
                var _self = $(_selector); //再次选择
                if( (_flag && _self.length) || (!_flag && !_self.length) ) { //判断是否取到
                    clearInterval(_iIntervalID);
                    resolve(_iIntervalID);
                }
            }, _interval);
        });
    }
})();
// ==UserScript==
// @name         童程xuexi、tmooc脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  童程xuexi见面课挂机脚本、童程tmooc去掉视频暂停按钮脚本
// @author       You
// @match        *://xuexi.tmooc.cn/*
// @match        *://code.tmooc.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log("童程脚本")
    // 点击继续学习方法
    function clickStudyBtn(){
        var timeFlag = setInterval (function(){
            var dvWarningView = document.getElementById("dvWarningView");
            //var btn2 = $("#dvWarningView");
            if(dvWarningView != null && $(dvWarningView).find("input") != null){
                $(dvWarningView).find("input").click();
            }
            var replaybtn = document.getElementById("replaybtn");
            //var btn2 = $("#dvWarningView");
            if(replaybtn != null && $(replaybtn).find("input") != null){
                $(replaybtn).remove();
            }
			      var shuiYin = $("div.jw-marquee.jw-marquee-extension")
			      if(shuiYin != null && shuiYin != ''){
                shuiYin.remove();
            }
        },5000);
    }
    // Your code here...
    $(document).ready(function () {
        //if (window.location.href.startsWith('http://xuexi.tmooc.cn')) {
            clickStudyBtn();
        //}
    })
})();
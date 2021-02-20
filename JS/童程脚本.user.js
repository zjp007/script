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
    //var jq = document.createElement('script');
    //jq.src = "https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js";
    //document.getElementsByTagName('head')[0].appendChild(jq);
    console.log("童程脚本")
    // 点击继续学习方法
    function clickStudyBtn(){
        //if (btn != null){
        var timeFlag = setInterval (function(){
            var dvWarningView = document.getElementById("dvWarningView");
            //var btn2 = $("#dvWarningView");
            if(dvWarningView != null && $(dvWarningView).find("input") != null){
                $(dvWarningView).find("input").click();
                console.log("点击继续学习");
            }else{
                console.log("未找到继续学习按钮");
            }
            var replaybtn = document.getElementById("replaybtn");
            //var btn2 = $("#dvWarningView");
            if(replaybtn != null && $(replaybtn).find("input") != null){
                $(replaybtn).remove();
                console.log("去掉暂停按钮");
            }else{
                console.log("未找到暂停按钮");
            }
        },5000);
        //}else{
        //    console("未找到继续学习按钮");
        //}
    }
    // Your code here...
    $(document).ready(function () {
        //if (window.location.href.startsWith('http://xuexi.tmooc.cn')) {
            clickStudyBtn();
        //}
    })
})();
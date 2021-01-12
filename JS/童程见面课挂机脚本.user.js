// ==UserScript==
// @name         童程见面课挂机脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://xuexi.tmooc.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var jq = document.createElement('script');
    jq.src = "https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(jq);
    console.log("童程见面课挂机脚本")
    // 点击继续学习方法
    function clickStudyBtn(){
        //if (btn != null){
        var timeFlag = setInterval (function(){
            var btn = document.getElementById("dvWarningView");
            //var btn2 = $("#dvWarningView");
            if(btn != null && $(btn).find("input") != null){
                $(btn).find("input").click();
                console.log("点击继续学习");
            }else{
                console.log("未找到继续学习按钮");
            }
        },5000);
        //}else{
        //    console("未找到继续学习按钮");
        //}
    }
    // Your code here...
    $(document).ready(function () {
        if (window.location.href.startsWith('http://xuexi.tmooc.cn')) {
            clickStudyBtn();
        }
    })
})();
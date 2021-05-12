// ==UserScript==
// @name         童程xuexi、tmooc脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  童程xuexi见面课挂机脚本、童程tmooc去掉视频暂停按钮脚本
// @author       You
// @match        *://xuexi.tmooc.cn/*
// @match        *://code.tmooc.cn/*
// @match        *://robot.tmooc.cn/*
// @grant        none
// ==/UserScript==
// 存储倍速到本地浏览器功能，需要完成！~
(function() {
    'use strict';
    console.log("童程脚本")
    // 点击继续学习方法
    function clickStudyBtn(){
        var timeFlag = setInterval (function(){
            var dvWarningView = document.getElementById("dvWarningView");
            //var btn2 = $("#dvWarningView");
            if(dvWarningView != null && $(dvWarningView).find("input") != null){
				// 点击继续学习
                $(dvWarningView).find("input").click();;
            }
            var replaybtn = document.getElementById("replaybtn");
            //var btn2 = $("#dvWarningView");
            if(replaybtn != null && $(replaybtn).find("input") != null){
				// 去掉视频暂停后的显示按钮
                $(replaybtn).remove();
            }
            var shuiYin = $("div.jw-marquee.jw-marquee-extension")
            if(shuiYin != null && shuiYin != ''){
				// 去掉水印
                shuiYin.remove();
            }
        },5000);
    }
    // 去除不能复制粘贴限制
    function removeCannotPaste(){
        var onPasteDom = $("body").find("[onpaste]");
        for (var i=0;i<onPasteDom.length;i++){
            $(onPasteDom[i]).attr('onpaste', '')
            $(onPasteDom[i]).attr('oncopy', '')
            $(onPasteDom[i]).attr('oncut', '')
            $(onPasteDom[i]).attr('onselectstart', '')
        }
        var onselectstartDom = $("html").find("[onselectstart]");
        for (var j=0;j<onselectstartDom.length;j++){
            $(onselectstartDom[j]).attr('onpaste', '')
            $(onselectstartDom[j]).attr('oncopy', '')
            $(onselectstartDom[j]).attr('oncut', '')
            $(onselectstartDom[j]).attr('onselectstart', '')
        }
    }
	// 添加高倍速选择,有延时
	function addVideoSpeed(){
		var timeFlag = setInterval (function(){
			var ulDom = $("ul.ccH5spul");
			ulDom.prepend('<li data-sp="2.5" class="" >2.5倍</li>')
			ulDom.prepend('<li data-sp="3.0" class="" >3倍</li>')
			var mySelf = '<li id="speeedLi" class="" >'+
					'<i class="addIDom" style="display: inline; onmouseover">+</i>' + 
					'<input id="addSpeedInput" type="number" max="16" step="0.5" title="增加新的倍数值" min="3.5" style="display: none;"></li>';
			ulDom.prepend(mySelf);
			eventBind();
			console.log("speed add");
			if (ulDom.length >= 0){
				clearInterval(timeFlag);
			}
		},1000);
	}
	// 事件绑定
	function eventBind(){
		//高倍速按钮回车事件绑定
		$('#addSpeedInput').bind('keypress', function(event) {
			if (event.keyCode == "13") {
				event.preventDefault();
				var videoSpeed = $('#addSpeedInput').val();
				//回车执行添加倍速
				$('#addSpeedInput').parent().after('<li data-sp="' + videoSpeed + '" class="">' + videoSpeed + '倍</li>');
				// 给新增的li（第二个li）添加点击事件
				$($("ul.ccH5spul li")[1]).click(function(){
						$("ul.ccH5spul li").removeClass("selected")
						$(this).addClass("selected");
						$("span.ccH5sp").text($(this).text())
						$("video")[0].playbackRate=Number($(this).attr("data-sp"));
				});
			}
		});
		// 给倍速按钮添加点击事件绑定（样式切换，视频速度切换）
		var liArray = $("ul.ccH5spul li");
		if(liArray.length > 0){
			for (var i = 0;i < liArray.length;i++){
				var li = $(liArray[i]);
				if(li.attr('data-sp') != undefined){
					li.click(function(){
						$("ul.ccH5spul li").removeClass("selected")
						$(this).addClass("selected");
						$("span.ccH5sp").text($(this).text())
						$("video")[0].playbackRate=Number($(this).attr("data-sp"));
					});
				}
			}
		}
		// 右侧视频列表，点击后会重新加载视频元素，重新添加倍速按钮
		var rightUlArray = $("ul.video-list li");
		if(rightUlArray.length > 0){
			for (var j = 0;j < rightUlArray.length;j++){
				var rightLi = $(rightUlArray[j]);
					rightLi.click(function(){
						console.log("rightUl click")
						addVideoSpeed();
					});
			}
		}
		// 加号，鼠标移入移出不生效
		var addIdom = $("i.addIDom");
		// 倍速输入框，鼠标移入移出不生效
		var speedInput = $('#addSpeedInput');
		// 添加倍速的的li
		var speeedLiDom = $("#speeedLi");
		speeedLiDom.mouseenter(function(){
            addIdom[0].style.display="none";
			speedInput[0].style.display="inline";
        });
        speeedLiDom.mouseleave(function(){
            addIdom[0].style.display="inline";
			speedInput[0].style.display="none";
        });
	}
	// Your code here...
	$(function(){
		//if (window.location.href.startsWith('http://xuexi.tmooc.cn')) {
		clickStudyBtn();
		removeCannotPaste();
		//}
		if (window.location.href.indexOf('code.tmooc.cn') > -1 || window.location.href.indexOf('robot.tmooc.cn')>-1){
			addVideoSpeed();
		}
	})
})();

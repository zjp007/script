// ==UserScript==
// @name         童程xuexi、tmooc脚本
// @namespace    http://tampermonkey.net/
// @version      0.8
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
	// 添加自定义样式到<head>标记中
	function loadStyle(css) {
	  var style = document.createElement('style');
	  style.type = 'text/css';
	  style.rel = 'stylesheet';
	  style.appendChild(document.createTextNode(css));
	  var head = document.getElementsByTagName('head')[0];
	  head.appendChild(style);

   }
   //自定义样式
	function addCss(){
		var css = '.add-speed-entry{font-size:inherit;'
			  + 'color:inherit;line-height:inherit;background:transparent;'
			  + 'outline:none;width:100%;border:none;text-align:center;}';
		css += '.add-speed-entry[type=number]{-moz-appearance:textfield;user-select:initial;'
			+'touch-action:manipulation;-webkit-appearance:none;text-decoration:none;overflow:visible;'
			+'}';
		css += 'input::-webkit-outer-spin-button,'
				+'input::-webkit-inner-spin-button{'
				+'-webkit-appearance: none !important;'
				+'margin: 0;}'
		css += '.removeLi{position:absolute;right:8px}';
		css += '.removeLi:hover{color:red;}';

	   loadStyle(css)
	}
	// 获取cookie值
	function getCookie(name) {
		var prefix = name + "="
		var start = document.cookie.indexOf(prefix)
	 
		if (start == -1) {
			return null;
		}
	 
		var end = document.cookie.indexOf(";", start + prefix.length)
		if (end == -1) {
			end = document.cookie.length;
		}
	 
		var value = document.cookie.substring(start + prefix.length, end)
		return unescape(value);
	}
	// 将字符串分隔为数组
	function splitStrToArray(str, splitStr){
		var returnArray = [];
		if (str != undefined && str != null && str != ''){
			returnArray = str.split(splitStr);
		}
		return returnArray
	}
	// 根据浏览器存储的值初始化倍速按钮
	function initSpeedBtn(ulDom){
		// 登录用户名
		var cookieName = getCookie("loginName");
		// 获取存储的倍数值
		var speedStorge = localStorage.getItem(cookieName);
		var userSpeedArry = splitStrToArray(speedStorge, ",");
		if (userSpeedArry != null && userSpeedArry != '' ){
			for (var m = userSpeedArry.length-1;m >=0;m--){
				ulDom.prepend('<li data-sp="' + userSpeedArry[m] + '" class="" >' + userSpeedArry[m] + '倍<i class="removeLi">×</i></li>')
			}
		}else{
			ulDom.prepend('<li data-sp="2.5" class="" >2.5倍<i class="removeLi">×</i></li>')
			ulDom.prepend('<li data-sp="3.0" class="" >3倍<i class="removeLi">×</i></li>')
		}
	}
	// 存储倍速到
	function saveSpeedStorge(){
		// 登录用户名
		var cookieName = getCookie("loginName");
		var data = "";
		var liArray = $("ul.ccH5spul li");
		if(liArray.length > 0){
			var liLength = liArray.length;
			var count = 1;
			while (liLength > 6){
				var li = $(liArray[count]);
				data += li.attr("data-sp") + ",";
				count++;
				liLength--;
			}
		}
		data = data.substring(0,data.length-1)
		console.log(data);
		localStorage.setItem(cookieName,data)
	}
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
			// 部分视频不会重新加载整个页面，需要进行判断
			// 已经添加自定义倍速的页面，不再进行添加
			var liArray = $("ul.ccH5spul li");
			if (liArray.length <= 5){
				var ulDom = $("ul.ccH5spul");
				initSpeedBtn(ulDom);
				var mySelf = '<li id="speeedLi" class="" >'+
						'<i class="addIDom" style="display: inline; onmouseover">+</i>' + 
						'<input id="addSpeedInput" class="add-speed-entry" type="number" max="16" step="0.5" title="增加新的倍数值" min="3.5" style="display: none;"></li>';
				ulDom.prepend(mySelf);
				eventBind();
				console.log("speed add");
			}
			if (liArray.length > 5){
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
				$('#addSpeedInput').parent().after('<li data-sp="' + videoSpeed + '" class="">' + videoSpeed 
									+ '倍<i class="removeLi">×</i></li>');
				// 给新增的li（第二个li）添加点击事件
				$($("ul.ccH5spul li")[1]).click(function(){
						$("ul.ccH5spul li").removeClass("selected")
						$(this).addClass("selected");
						$("span.ccH5sp").text($(this).text())
						$("video")[0].playbackRate=Number($(this).attr("data-sp"));
				});
				// 
				var removeIbtn = $("i.removeLi");
				$(removeIbtn[0]).click(function(){
					$(this).parent().remove();
						saveSpeedStorge();
				})
				saveSpeedStorge();
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
						var speedText = $(this).text();
						if(speedText.indexOf("×") > -1){
							speedText = speedText.substring(0,speedText.length-1);
						}
						$("span.ccH5sp").text(speedText)
						$("video")[0].playbackRate=Number($(this).attr("data-sp"));
						
					});
				}
			}
		}
		// 右侧视频列表，点击后会重新加载视频元素，重新添加倍速按钮
		var rightUlArray = $("ul.video-list li");
		if (rightUlArray.length <= 0){
			// robot.tmooc.cn适配
			rightUlArray = $("#video-list li");
		}
		if(rightUlArray.length > 0){
			for (var j = 0;j < rightUlArray.length;j++){
				var rightLi = $(rightUlArray[j]);
					rightLi.click(function(){
						addVideoSpeed();
					});
			}
		}
		// 给删除i标记绑定事件
		var removeIbtn = $("i.removeLi");
		if (removeIbtn != undefined && removeIbtn.length > 0){
			for (var n = 0;n < removeIbtn.length;n++){
				var removeI = $(removeIbtn[n]);
					removeI.click(function(){
						$(this).parent().remove();
						saveSpeedStorge();
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
			speedInput.attr("autofocus",'true');
        });
        speeedLiDom.mouseleave(function(){
            addIdom[0].style.display="inline";
			speedInput[0].style.display="none";
        });
	}
	// Your code here...
	$(function(){
		removeCannotPaste();
		if (window.location.href.indexOf('xuexi.tmooc.cn')>-1) {
			clickStudyBtn();
		}
		if (window.location.href.indexOf('code.tmooc.cn') > -1 || window.location.href.indexOf('robot.tmooc.cn')>-1){
			addCss();
			addVideoSpeed();
		}
	})
})();

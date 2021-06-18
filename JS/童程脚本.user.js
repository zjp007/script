// ==UserScript==
// @name         童程xuexi、tmooc脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  童程xuexi见面课挂机脚本、童程tmooc去掉视频暂停按钮脚本
// @author       You
// @match        *://xuexi.tmooc.cn/*
// @match        *://code.tmooc.cn/*
// @match        *://robot.tmooc.cn/*
// @match        *://pdf.ajiatech.com/*
// @grant        none
// ==/UserScript==
(function() {
	var videoLocalSpeed = 1;
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
		// 自定义倍速样式
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
        // 去暂停按钮
        css += '#replaybtn{display:none !important;}';
        // 去水印
        css += 'div.jw-marquee.jw-marquee-extension{display:none !important;}';
	   loadStyle(css)
	}
	// 隐藏TTS阶段考试的答案和解析
	function addCssFortts(){
		var css = 'input[type="radio"]{display:none !important;}';
		css += 'input[type="checkbox"]{display:none !important;}';
		css += 'div.exam_result{display:none !important;}';
		// 试题代码格式
		css += 'xmp{line-height: 1.4em;'
			 + 'width: 98%;'
			 + 'padding: 5px;'
			 + 'font-size: 110%;'
			 + 'font-family: Menlo,Monaco,Consolas,"Andale Mono","lucida console","Courier New",monospace;'
			 + 'white-space: pre-wrap;'
			 + 'word-break: break-all;'
			 + 'word-wrap: break-word;}'
	   loadStyle(css)
	}
	// 复制下载连接样式
	function aDownloadCss(){
		var css = '.copyDiv{position: fixed;right: 10px;bottom: 120px;'
				+'width: 54px;background: white;border-radius: 4px;'
				+'overflow: hidden;}';
		css += '.copyDiv:hover{background: #1a8bc0;}';
		css += '.copyDiv a{font-size: 16px;display: inline-block;'
			+ 'width: 54px;height: 54px;text-align: center;'
			+ 'line-height: 54px;}';
		css += '.copyDiv a:hover{color: white}';
		loadStyle(css);
	}
	// 更改TTS考试标题
	function changeTtsTitleName(){
		var titleTxt = $("title").text();
        titleTxt = titleTxt.substring(titleTxt.indexOf("Level")) + " 考试";
        $("#exam_title").text(titleTxt);
	}
	// TTS问题加上括号
	function changeQuestionTitle(){
		var questionDomArr = $("div.question xmp");
		for(var i = 0;i<questionDomArr.length;i++){
			var questionTxt = $(questionDomArr[i]).text();
			$(questionDomArr[i]).text(questionTxt + " (  ) ");
		}
	}
	// 打印答案到控制台上
	function printTTSAnswer(){
		var answerDomArr = $("div.exam_result p");
		var count = 1;
		for(var i = 0;i<answerDomArr.length;i++){
			var answerTxt = $(answerDomArr[i]).text();
			if(answerTxt == "" || answerTxt == '' || answerTxt == null)
			{
				$(answerDomArr[i]).remove();
				continue;
			}
			// 答案格式["正确答案：A"]
			answerTxt = count + " : " + answerTxt.substring(5) + "\n";
			$(answerDomArr[i]).text(answerTxt);
			count++;
		}
		console.log(answerDomArr.text())
	}
	// 获取所有下载资料的链接
	function getDownloadStr(){
		var downloadStr = "";
		// 所有a标签
		var aSumList = $("a.class-enter");
		// 存储下载资料的a标签
		var aDownloadList = [];
		for(var i = 0;i<aSumList.length;i++){
			var aHref = $(aSumList[i]).attr('href');
			if (aHref.indexOf('html') < 0){
				aDownloadList.push(aSumList[i]);
				downloadStr += aHref + "\n";
			}
			//name = aHref.substring(aHref.lastIndexOf('/') + 1);
		}
		return downloadStr;
	}
	function printDownloadHref(){
		// 参考元素class名
		var domClassName = ".footer";
		waitElement(domClassName).then(function(){
			var btnStr = //'<div class="copyDiv">'
					'<button id="copyBtn">复制下载连接</button>'
					//+'</div>';
			$(domClassName).prepend(btnStr);
			$("#copyBtn").on('click', function(){
				downloadStr = getDownloadStr();
				copyText(downloadStr);
			})
		});
		var bottomDomStr = ".fixed-box-x";
		waitElement(bottomDomStr).then(function(){
			var btnStr = '<div class="copyDiv">'
					+'<a href="#copyBtn">END</a>'
					+'</div>';
			$(bottomDomStr).before(btnStr);
		});
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
	// 复制文本到剪切板
	function copyText(text) {
        //var textarea = document.createElement("input");//创建input对象
		var textarea = document.createElement("textarea");//创建input对象
        var currentFocus = document.activeElement;//当前获得焦点的元素
        document.body.appendChild(textarea);//添加元素
        textarea.value = text;
        textarea.focus();
        if(textarea.setSelectionRange)
            textarea.setSelectionRange(0, textarea.value.length);//获取光标起始位置到结束位置
        else
            textarea.select();
        try {
            var flag = document.execCommand("copy");//执行复制
        } catch(eo) {
            var flag = false;
        }
        document.body.removeChild(textarea);//删除元素
        currentFocus.focus();
        return flag;
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
			ulDom.prepend('<li data-sp="3" class="" >3倍<i class="removeLi">×</i></li>')
		}
	}
	// 初始化video播放速度
	function initVideoSpeed(){
		// 等待视频video加载完成后进行设置倍速
		waitElement("video").then(function(){
			// 缓冲时间
			var count = 10;
			var initVideoSpeedFlag = setInterval (function(){
				// 获取存储的倍数值
				var videoStorge = Number(localStorage.getItem("codeVideoSpeed"));
				var currentSpeed = $("video")[0].playbackRate;
				// console.log("videoStorge : " + videoStorge)
				// console.log("currentSpeed : " + currentSpeed)
				if (videoStorge != null && videoStorge != ''){
					// 设置视频倍速
					$("video")[0].playbackRate=videoStorge;
					// 设置显示当前倍速
					var speedLi =$("ul").find('li[data-sp="' + videoStorge +'"]');
					$("ul.ccH5spul li").removeClass("selected");
					speedLi.addClass("selected");
					var speedText = speedLi.text();
					if(speedText.indexOf("×") > -1){
						speedText = speedText.substring(0,speedText.length-1);
					}
					$("span.ccH5sp").text(speedText)
				}else{
					$("video")[0].playbackRate=1;
				}
				if (currentSpeed == videoStorge){
					count--;
					if (count<=0){
						clearInterval(initVideoSpeedFlag);
					}
				}
			},1000);
		})
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
		localStorage.setItem(cookieName,data)
	}
    // 点击继续学习方法
    function clickStudyBtn(){
        var timeFlag = setInterval (function(){
            //var dvWarningView = document.getElementById("dvWarningView");
            var dvWarningView = $("#dvWarningView");
            if(dvWarningView != null && $(dvWarningView).find("input") != null){
				// 点击继续学习
                $(dvWarningView).find("input").click();;
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
				// 元素事件绑定
				eventBind();
				console.log("speed add");
			}
			if (liArray.length > 5){
				clearInterval(timeFlag);
			}
		},1000);
	}
	// liClickFun
	function speedBtnFun(liDom){
		$("ul.ccH5spul li").removeClass("selected")
		$(liDom).addClass("selected");
		var speedText = $(liDom).text();
		if(speedText.indexOf("×") > -1){
			speedText = speedText.substring(0,speedText.length-1);
		}
		$("span.ccH5sp").text(speedText)
		console.log($(liDom).attr("data-sp"));
		var speedStr = $(liDom).attr("data-sp");
		localStorage.setItem("codeVideoSpeed",speedStr);
		$("video")[0].playbackRate=Number(speedStr);
		// videoLocalSpeed = Number($(liDom).attr("data-sp"));
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
						speedBtnFun(this);
				});
				// 删除自定义倍速
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
						speedBtnFun(this);
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
						// 初始化video播放速度
						initVideoSpeed();
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
		// 去除不能复制粘贴限制
		removeCannotPaste();
		// 云学堂点击继续学习，每5秒点击一次
		if (window.location.href.indexOf('xuexi.tmooc.cn')>-1) {
			clickStudyBtn();
		}
		// 课堂视频网站（童创童创都可以），去暂停按钮，添加自定义倍速
		if (window.location.href.indexOf('code.tmooc.cn/web/kids') > -1 || window.location.href.indexOf('robot.tmooc.cn')>-1){
			addCss();
			addVideoSpeed();
			// 初始化video播放速度
			initVideoSpeed();
		}
		// TTS阶段性考试去掉答案和解析,代码格式化，打印答案到控制台上
		if(window.location.href.indexOf('pdf.ajiatech.com/tctm/kid/QS/result/web/exam/')>-1){
			addCssFortts();
			changeTtsTitleName();
			changeQuestionTitle();
			printTTSAnswer();
		}
		if(window.location.href.indexOf('code.tmooc.cn/kidcourse/kids')>-1){
			aDownloadCss()
			// 多课件下载
			printDownloadHref()
		}
	})
})();
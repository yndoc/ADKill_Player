/*
 * This file is part of ADkill Player Offline
 * <http://bbs.kafan.cn/thread-1514537-1-1.html>,
 * Copyright (C) yndoc xplsy 15536900
 * Some codes came from:
 * "Proxy SwitchySharp" (Shyc2001 http://twitter.com/shyc2001)
 * ADkill Player Offline is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * GNU General Public License, see <http://www.gnu.org/licenses/>.
 */

var taburls = [];       //存放tab的url与flag，用作判断重定向
var blockurls=[];       //存放当前阻挡的url
var flushallow = 1;     //用于控制是否自动清理缓存,1为自动,0为手动.
var compatible = 0;	//用于控制是否启动代理控制,1为禁用,0为启用.
var proxyflag = "";	//proxy调试标记,改为存储proxy的具体IP地址
var proxyget = 0;       //在proxy部分将被临时使用
var cacheflag = false;	//用于确定是否需要清理缓存,注意由于隐身窗口的cookie与缓存都独立与普通窗口,因此使用API无法清理隐身窗口的缓存与cookie.
//var xhr = new XMLHttpRequest();	

//====================================Crossdomin Spoofer Test
//pac script
var pac = {
	mode: "pac_script",
	pacScript: {
	data: "function FindProxyForURL(url, host) {\n" +
		"	var regexpr = /.*\\/crossdomain\\.xml/;\n" +	//使用过程中\\将被解析成\,所以在正常正则表达式中的\/需要改写成\\/
		"	if(regexpr.test(url)){\n " +
		"		return 'PROXY yk.pp.navi.youku.com:80';\n" +
		"	}\n" +
		"	return 'DIRECT';\n" +
		"}"
	}
};
//Permission Check + Proxy Control
function ProxyControl(pram , ip) {
	if(!compatible) {
		if(versionPraser() == 40 ) {	//用于应对Chrome 40版本中引入的Proxy BUG
			console.log("Proxy: Chrome = 40");
			if(pram == "set"){
				console.log("Setup Proxy");
				chrome.proxy.settings.set({value: pac, scope: "regular"}, function(details) {});
				}
			if(pram == "unset"){
				console.log("Release Proxy");
				chrome.proxy.settings.clear({scope: "regular"});
				if(typeof(ip) == 'undefined') ip = "none";
				FlushCache(ip);
				}			
		} else {
			chrome.proxy.settings.get({incognito: false}, function(config){
				//console.log(config.levelOfControl);
				//console.log(config);
				//console.log(pac);
				try
				{
					switch(config.levelOfControl) {
						case "controllable_by_this_extension":
						// 可获得proxy控制权限，显示信息
						console.log("Have Proxy Permission");
		//				proxyflag = 1;
						if(pram == "set"){
							console.log("Setup Proxy");
							chrome.proxy.settings.set({value: pac, scope: "regular"}, function(details) {});
						}
						break;	

						case "controlled_by_this_extension":
						// 已控制proxy，显示信息
						console.log("Already controlled");
		//				proxyflag = 2;
						if(pram == "unset"){
							console.log("Release Proxy");
							chrome.proxy.settings.clear({scope: "regular"});
							if(typeof(ip) == 'undefined') ip = "none";
							FlushCache(ip);
						}
						break;	

						default:
						// 未获得proxy控制权限，显示信息
						warn();	//添加无权限提醒
						console.log("No Proxy Permission");
						console.log("Skip Proxy Control");
		//				proxyflag = 0;
						break;	

					}
				}
				catch(err){
					console.log("ERROR:Can Not Read Proxy !");
				}
			});
		}

	}
}
function FlushCache(ip) {
	if(flushallow && !chrome.runtime.lastError && ( cacheflag && ip.slice(0,ip.lastIndexOf(".")) != proxyflag.slice(0,proxyflag.lastIndexOf(".")) || ip == "none") ) { //ip地址前3段一致即可,如果上次出错则跳过
		chrome.browsingData.remove(
			{},{
			"cache": true,
			"fileSystems": true,
		},
		function() {
			console.log('Now flushing Cache!');
		});
	}
}
//Listeners
chrome.webRequest.onBeforeRequest.addListener(function(details) {
	for (var i = 0; i < proxylist.length; i++) {
		if (proxylist[i].find.test(details.url) && proxylist[i].extra == "crossdomain") {
			//console.log(details);
			console.log('Crossdomin Spoofer Rule : ' + proxylist[i].name);
			var id = "tabid" + details.tabId;
			if(typeof(taburls[id]) == "undefined") {
				console.log("Init taburls")
				taburls[id] = []; //初始化
			}
			taburls[id][2] = i; //存储当前proxy
			switch (proxylist[i].name) {
				
				case "crossdomain_iqiyi|pps-c1":
				taburls[id][2] = i+2; //定位crossdomain_iqiyi|pps-main规则位置
				
				case "crossdomain_iqiyi|pps-c2":
				taburls[id][2] = i+1; //定位crossdomain_iqiyi|pps-main规则位置
				
				case "crossdomain_tudou":   //特殊规则
				case "crossdomain_tudou_sp":
				case "crossdomain_iqiyi|pps-main":
				//taburls[id] = [];
				taburls[id][3] = false;
				taburls[id][4] = false;
				
				default:
				//console.log("In Proxy Set");
				ProxyControl("set");
				break;
			}
		}
	}
	//return {cancel: false};
},
{urls: ["http://*/*", "https://*/*"]},
["blocking"]);

chrome.webRequest.onCompleted.addListener(function(details) {
	var bflag = true;
	for (var i = 0; i < proxylist.length; i++) {
		//获取Proxy的具体IP地址
		if(details.url.indexOf(baesite[0].slice(0,-6)) >= 0 && details.url.indexOf("crossdomain.xml") >= 0) {  //:xxxxx 6个字符,差不多就行
			//只在扩展启动时处理
			if(!proxyget) return; //不在过程中就终止
			proxyget = 0;
			console.log(details.url);
			if(flushallow && details.fromCache) { //如果crossdomain来自于本地缓存,那么需要清除缓存后重新获取
				FlushCache("none");
				var timer=setTimeout(getProxyIP,5000);  //5s时间延迟
				return;
			}
			//console.log(details);
			proxyflag = details.ip;
			console.log("Capture Proxy IP :" + proxyflag);
			return;
		}
		if (proxylist[i].monitor.test(details.url) && proxylist[i].extra == "crossdomain") {
			//console.log(details);
			cacheflag = false;
			cacheflag = details.fromCache;
			console.log("Capture Moniter Url :" + details.url + " fromCache :" + details.fromCache + " ip :" + details.ip);
			var id = "tabid" + details.tabId;
			switch (proxylist[taburls[id][2]].name) {

				case "crossdomain_tudou":   //特殊规则
				case "crossdomain_tudou_sp":
				case "crossdomain_iqiyi|pps-main":
				if(typeof(taburls[id]) != "undefined" && typeof(proxylist[taburls[id][2]].exfind) != "undefined") {   //防止规则与扩展版本不适应
					if(proxylist[taburls[id][2]].monitor.test(details.url)) taburls[id][3]=true;
					if(proxylist[taburls[id][2]].exfind.test(details.url)) taburls[id][4]=true;
					if(taburls[id][3] && taburls[id][4]){
						bflag = true;
					}else{
						bflag = false;
						console.log("Hold Proxy in " + proxylist[taburls[id][2]].name);
					}
				}else{
				bflag = false;
				console.log("Error!(Hold Proxy) ");
				}
				//break;

				default:
				if(bflag) {
					console.log("Now Release Proxy ");
					ProxyControl("unset" , details.ip);
				}
				break;

			}
			
			if(bflag) break;
		}
	}
	
},
{urls:  ["http://*/*", "https://*/*"]});

//标签开启
chrome.tabs.onCreated.addListener(function(tab) {
	ProxyControl("unset");
});

///标签关闭
chrome.tabs.onRemoved.addListener(function(tabId) {
	ProxyControl("unset");
});
//载入获取Proxy的IP地址
function getProxyIP() {
	if(baesite[0] != '') {
		var xhr = new XMLHttpRequest();
		url = "http://" + baesite[0] + "/crossdomain.xml";
		xhr.open("GET", url, true);
		xhr.send();
	}
}

function warn() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {	//获取当前活动tab id
//		if(pram=="set") {
			chrome.browserAction.setBadgeText({"text": "Stop", tabId: tabs[0].id});	//提醒
/*		}else{
			chrome.browserAction.setBadgeText({"text": "", tabId: tabs[0].id});	//清除提醒
		}
*/
	});
}
//====================================Headers Modifier Test
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	//console.log(details);
	for (var i = 0; i < refererslist.length; i++) {
		if (refererslist[i].find.test(details.url)) {
			//console.log(details);
			console.log('Referer Modifier Rule : ' + refererslist[i].name);
			for (var j = 0; j < details.requestHeaders.length; ++j) {
				if (details.requestHeaders[j].name === 'Referer') {
				//console.log(details.requestHeaders[j]);
					switch (refererslist[i].name) {
						case "referer_youku":
						if (/(youku|tudou)/i.test(details.requestHeaders[j].value)) {
							console.log("Referer Modifier : No need to change");
							break;
						}
						
						case "referer_iqiyi":
						if (/qiyi\.com/i.test(details.requestHeaders[j].value)) {
							console.log("Referer Modifier : No need to change");
							break;
						}

						default:
						console.log("Referer Modifier : Switch Default");
						if (refererslist[i].extra === "remove"){
							console.log('Referer Modifier Action : Remove');
							details.requestHeaders.splice(j, 1);
						} else {
							console.log('Referer Modifier Action : Modify');
							details.requestHeaders[j].value = refererslist[i].replace;
						}
						break;
					}

				//console.log(details.requestHeaders[j]);
					break;
				}
				/*if (details.requestHeaders[i].name === 'User-Agent') {
					//details.requestHeaders.splice(i, 1);
					details.requestHeaders[i].value = "Mozilla/5.0 (LETVC1;iPad; CPU OS 5_0 like Mac OS X) AppleWebKit/535.35 (KHTML, like Gecko)";
					//console.log(details.requestHeaders[i]);
				}*/
			}
		}
	}
	//Add Cache Controler
/*	for (var i = 0; i < proxylist.length; i++){
			if (proxylist[i].realurl.test(details.url)) {
				console.log('Cache-Control Modifier');
				for (var j = 0; j < details.requestHeaders.length; ++j) {
					if (details.requestHeaders[j].name === 'Cache-Control') {
						details.requestHeaders[j].value = "no-cache";
				}
				break;
			}
		}
	}

*/
	return {requestHeaders: details.requestHeaders};
},{urls: ["http://*/*", "https://*/*"]},
["blocking", "requestHeaders"]);
//====================================CSS injector
function insertCSS(tabId , Details) {
	chrome.tabs.insertCSS(tabId ,Details, function() {
		if (chrome.runtime.lastError) {
			console.log('Not allowed to inject CSS into page.');
		} else {
			console.log('CSS : Injected style!');
		}
	});
}
//====================================
///阻挡广告及重定向
chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
	var url = details.url;
	var id = "tabid" + details.tabId; //记录当前请求所属标签的id
	var type = details.type;

	if (details.tabId == -1) //不是标签的请求直接放过
		return;

	if (type == "main_frame") { //是标签主框架的url请求
		console.log(id);
		//console.log(url);
		taburls[id] = []; //二维数组
		taburls[id][0] = url;
//		console.log(url);
		taburls[id][1] = 1; //默认值,对于iqiyi来说是载入v5播放器,对于letv来说是载入普通LETV播放器可本地。
		//=======================
		if (/.*\.iqiyi\.com/i.test(url)) { //消耗流量与资源对iqiyi进一步判断。
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {	
//					console.log(/iqiyi|letv/i.exec(url));
					switch (/iqiyi|letv/i.exec(url)[0]) {
						case "iqiyi":
						console.log("XHR Switch : iqiyi|pps");
						taburls[id][1] = /data-flashplayerparam-flashurl/i.test(xhr.responseText);
						break;
/*
						case "letv":
						console.log("XHR Switch : letv");
						taburls[id][1] = !/VLetvPlayer/.test(xhr.responseText);
						break;
*/
						default:
						console.log("XHR Switch : default");
						break;
					}					
					console.log("Url : " + taburls[id][0]);
					console.log("Flag State : " + taburls[id][1]);
					//console.log(xhr.responseText);
				}
			}
			xhr.send();
		}
//=======================
	} else {
//		console.log(id);
	}

	try {//在此运行代码

		var testUrl = taburls[id][0]; //该请求所属标签的url
	} catch(err) {

		return;//在此处理异常
	}
	
	//console.log(testUrl);


	//URL重定向列表
	for (var i = 0; i < redirectlist.length; i++) {
		var extra=redirectlist[i].extra;
		//var nameid=redirectlist[i].name;
		if((extra=="adkillrule"||extra=="crossdomain")&&!localStorage["adkill"])//关闭去广告时去广告的规则失效
			continue;
		if(extra=="adkillrule2"&&type=="main_frame")//是主框架请求则规则失效
			continue;
		if (redirectlist[i].find.test(url)) {
			console.log(url);
			var newUrl = url.replace(redirectlist[i].find, redirectlist[i].replace);
			//重定向细化规则部分开始
			//console.log(redirectlist[i].name);
			console.log("Switch : " + redirectlist[i].name);
			switch (redirectlist[i].name)
			{
				case "letv":
				//case "letv_out":
				//console.log("switch : letv");
				letvflag = taburls[id][1];
				if (/(bilibili|acfun|(comic|hz)\.letv|duowan)/i.test(testUrl) && localflag) { //特殊网址的Flash内部调用特例,只处理设置为本地模式的情况
					newUrl = url.replace(redirectlist[i].find, baesite[2] + 'letv.swf'); //转换成在线
					} 
				break;
				
/*				case "letv_c":
				//console.log("switch : letv_c");
				letvflag = taburls[id][1];
				if (/(?!(bilibili|jd\.com))/i.test(testUrl) || !letvflag && localflag) { //特殊网址的Flash内部调用特例,只处理设置为本地模式的情况
					//newUrl = url.replace(redirectlist[i].find,baesite[ getRandom(3) ] + 'letv.swf');
					newUrl = url.replace(redirectlist[i].find, baesite[1] + 'letv0225.swf'); //转换成在线
				}
				break;
*/
				case "iqiyi":
				//console.log("Switch : iqiyi");	
				if(/v\..*iqiyi\.com/i.test(testUrl)){	//强制v5名单 无法使用v5flag进行判断的特殊类型
					console.log("Force to iqiyi5");
				} else {
					//if (/(baidu|61|178)\.iqiyi\.com|zybus\.net|tieba|(weibo|58dm)\.com/i.test(testUrl)) { //外链名单
					if (/(baidu|61|178)\.iqiyi\.com|bili|acfun|&source=/i.test(testUrl)) { //外链名单
						console.log("Out Side");
						if (/(bili|acfun)/i.test(testUrl)) { //特殊网址Flash内部调用切换到非本地模式
							newUrl = url.replace(redirectlist[i].find, baesite[2] + 'iqiyi_out.swf');
						} else {
							newUrl = newUrl.replace(/iqiyi5/i, 'iqiyi_out');
						}
					} else { //iqiyi本站v4 v5
						//newUrl = newUrl.replace(/iqiyi5/i,'iqiyi');	//先行替换成v4
						console.log("Judge Flag");
						v5flag = taburls[id][1]; //读取flag存储
						if (!v5flag || /pps\.tv/i.test(testUrl)) {	//不满足v5条件换成v4,或者在pps.tv域名下强制改变
							newUrl = newUrl.replace(/iqiyi5/i, 'iqiyi');
						}  else {
							if (/(^((?!(iqiyi)).)*\.(com|tv|net|cn|org|edu|ba)\/)/i.test(testUrl)){//不满足以上条件的且非iqiyi本站(及主连接中不含iqiyi)强制使用本地iqiyi_out
							newUrl = newUrl.replace(/iqiyi5/i, 'iqiyi_out');
							}
						}
					}
				}
				break;

				case "youkuloader":
				//console.log("Switch : youku");
				if (redirectlist[i].exfind.test(testUrl) && localflag) { //特殊网址Flash内部调用切换到非本地模式
						newUrl = url.replace(redirectlist[i].find, baesite[2] + 'loader.swf');
					}
				break;
				
				case "youkuplayer":
				//console.log("Switch : youku");
				if (redirectlist[i].exfind.test(testUrl) && localflag) { //特殊网址Flash内部调用切换到非本地模式
						newUrl = url.replace(redirectlist[i].find, baesite[2] + 'player.swf');
					}
				break;
				
				case "tudou":
				//console.log("Switch : tudou");
				if (/narutom/i.test(testUrl)) { //特殊网址由于网页本身参数不全无法替换tudou
						console.log("Can not redirect Player!");
						newUrl = url;
					}
/*				if (/tudou\.com/i.test(testUrl)) {//此为修复土豆CCS代码，默认已注释！使用老版本的请自行取消注释即可。
					console.log("Tudou CSS");
					insertCSS(details.tabId ,{code: "#player > .player_box{height:inherit !important;}"});
				}
*/				break;

				case "sohu":
				//case "sohu_live":
				//console.log("Switch : sohu");
				letvflag = taburls[id][1];
				if (/bili|acfun/i.test(testUrl) && localflag) { //特殊网址的Flash内部调用特例,只处理设置为本地模式的情况
					newUrl = url.replace(redirectlist[i].find, baesite[2] + 'sohu.swf'); //转换成在线
					}
				break;
				
				case "sohu_live":
				//console.log("Switch : sohu");
				letvflag = taburls[id][1];
				if (/bili|acfun|live/i.test(testUrl) && localflag) { //特殊网址的Flash内部调用特例,只处理设置为本地模式的情况
					newUrl = url.replace(redirectlist[i].find, baesite[1] + 'sohu/sohu_live.swf'); //转换成在线
				}
				break;

				case "17173_live":
				//console.log("Switch : 17173_live");
				if(/v\.17173\.com/i.test(testUrl)) { //17173直播主站css修正
					console.log("17173_live CSS");
					insertCSS(details.tabId , {code: "#flashBox>#livePlayerMin {height: 549px !important;}"});
					}
				break;
				
				default:
				console.log("Switch : Default");
				break;
			}

	//重定向细化规则部分结束
			console.log(newUrl);
			newUrl = decodeURIComponent(newUrl);
			if(i<2 && !/^https?|^chrome-extension:\/\//.test(newUrl))
				newUrl=chrome.extension.getURL(newUrl);
			if(i==2 && redirectlist[i].excode)
				chrome.tabs.executeScript(details.tabId,{code: redirectlist[i].excode});
			return {redirectUrl: newUrl};
			}
		}
		
	if(!localStorage["adkill"] || type=="main_frame")//关闭去广告 或 main_frame说明是新标签主框架url请求，放过(放在后面防止影响重定向结果)
			return;
	return {
		cancel: false
	};
},
{urls: ["http://*/*", "https://*/*"]
}, ["blocking"]);

///标签更新，清除该标签之前记录
chrome.tabs.onUpdated.addListener( function( tabId, changeInfo ){
	if(changeInfo.status=="loading")//在载入之前清除之前记录
	{
		var id="tabid"+tabId;//记录当前请求所属标签的id

		if(blockurls[id])
			blockurls[id]=[];
	}

} );

///标签关闭
chrome.tabs.onRemoved.addListener(function(tabId) {
	var id = "tabid" + tabId; //记录当前请求所属标签的id
	if (taburls[id])
		delete taburls[id];
});

//首次使用的初始化工作
var cmdlist=["adkill"];
for(var i=0;i<cmdlist.length;i++)
{
	var name=cmdlist[i];
	if(localStorage[name]==undefined)//默认开启所有功能
		localStorage[name]="checked";

	if(localStorage['flushallow'] == undefined){
		localStorage['flushallow'] = flushallow;
	}else{
		flushallow = Number(localStorage['flushallow']);
	}
	if(!flushallow) console.warn("Now Extension Has Already Been Set To Manual Flush Mode!! This Mode Can Cause System Instability!!");
	if(localStorage['compatible'] == undefined){
		localStorage['compatible'] = compatible;
		console.log("Now Extension Has Already Been Set To Auto Mode!!");
	}else{
		compatible = Number(localStorage['compatible']);
	}
	if(compatible) {
		console.log("Now Extension Has Already Been Set To Compatible Mode!!");
		console.warn("You Need Add Rules In Other Extension By Manual Actions");
		console.warn("Compatible To Other Extension Which Need Proxy Permission");
	}else{
		console.log("Now Extension Has Already Been Set To Proxy Mode!!");
	}
};

function versionPraser() {
	return(parseInt(/\d+/i.exec(/Chrome\/\d+\.\d+\.\d+\.\d+/i.exec(navigator.userAgent))));
}
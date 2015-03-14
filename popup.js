	document.addEventListener('DOMContentLoaded', function () {
		//document.querySelector('button').addEventListener('click', clickHandler);
		document.getElementById("whitecheck").addEventListener('click', function(){whitepage(this.checked);});
	});

	var BG = chrome.extension.getBackgroundPage();
	var tabtitle;//当前标签标题

	function whitepage(checked) 
	{
		if(!localStorage["adkill"])//未开启去广告功能
			return;
		chrome.windows.getCurrent(function(wnd){
			chrome.tabs.getSelected(wnd.id, function(tab){
				BG.whitetab["tabid"+tab.id]=checked?false:true;
				chrome.tabs.update(tab.id, {url: tab.url});
				window.close();
			});
		});
	}

	function setValue(obj)//保存选项设置
	{
		var name=obj.id;
		localStorage[name]=obj.checked?"checked":"";
		showSavingSucceedTip();
	}
	function showSavingSucceedTip() {
		var latency=0;//延时
		if(tipdiv.style.display=="block")//当前已有提示框
		{
			window.clearTimeout(tipTimerId);
			tipdiv.style.display="none";
			latency=100;
			window.setTimeout(function() {
				tipdiv.style.display="block";
			}, latency);
		}
		else//当前没有提示框
		{
			tipdiv.style.display="block";
		}
		tipTimerId=window.setTimeout(function() {
			tipdiv.style.display="none";
		}, 2000+latency);
	}

	var BG = chrome.extension.getBackgroundPage();
	var tipTimerId;//提示框的计时器id
	var tipdiv = document.createElement('DIV');
	tipdiv.className = 'tip_succeed';
	tipdiv.innerText = "选项已保存";
	document.body.appendChild(tipdiv);
	tipdiv.style.left = (document.body.clientWidth - tipdiv.clientWidth) / 2 + 'px';
	tipdiv.style.display="none";

	for(var i=0;i<BG.cmdlist.length;i++)//初始化各选项
	{
		var name=BG.cmdlist[i];
		var checked=localStorage[name]? 'checked' : '';
		document.getElementById(name).checked = checked;
		document.getElementById(name).addEventListener('click', function(){setValue(this);});
	};

	for(var i=0;i<2;i++)//初始化代理模式选项
	{
		var obj=document.getElementById("mode"+i);
		obj.value=i;
		obj.addEventListener('click', function(){changemode(this);});
		if(i==localStorage["compatible"])
			obj.checked = 'checked';
	}

	function changemode(obj)//选择代理模式
	{
		localStorage["compatible"]=obj.value;
		showSavingSucceedTip();
	}

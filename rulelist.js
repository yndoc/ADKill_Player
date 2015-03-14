//URL重定向规则(用于替换优酷播放器、去除google重定向等功能)
/*格式：
	name:规则名称
	find:匹配(正则)表达式
	replace:替换(正则)表达式
	extra:额外的属性,如adkillrule代表是去广告规则
*/

function getUrl(path)
		{
		return chrome.extension.getURL(path);
		}
function getRandom(num)	//生成0到num-1的伪随机数
		{
		return Math.floor(Math.random()*num);
		}

var baesite = ['yk.pp.navi.youku.com:80','http://code.taobao.org/svn/noadsplayer/trunk/Player/','http://noads.aliapp.com/swf/','http://noads.mujj.us/swf/']; 
var localflag = 1; 
//本地模式开启标示,1为本地,0为在线.在特殊网址即使开启本地模式仍会需要使用在线服务器,程序将会自行替换

//URL重定向规则(用于替换播放器)

var redirectlist = [{
		name: "youkuloader",
		find: /http:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/swf\/loaders?[^\.]*\.swf/i,
		exfind: /(bili|acfun)/,
		replace: localflag ? getUrl('swf/loader.swf') : baesite[2] + 'loader.swf',
		extra: "adkillrule"
	},{
		name: "youkuplayer",
		find: /http:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/swf\/(q?player[^\.]*|\w{13})\.swf/i,
		exfind: /(bili|acfun)/,
		replace: localflag ? getUrl('swf/player.swf') : baesite[2] + 'player.swf',
		extra: "adkillrule"
	},{
		name:"ku6",
		find: /^http:\/\/player\.ku6cdn\.com\/default\/.*\/\d+\/(v|player)[^\.]*\.swf/i,
		replace: localflag ? getUrl('swf/ku6.swf') : baesite[2] + 'ku6.swf',
		extra:"adkillrule"
	},{
		name:"ku6_out",
		find: /^http:\/\/player\.ku6\.com\/(inside|refer)\/([^\/]+)\/v\.swf/i,
		replace: (localflag ? getUrl('swf/ku6_out.swf') : baesite[2] + 'ku6_out.swf')+ '?vid=$2',
		extra: "adkillrule"
	},{
		name: "tudou",
		find: /^http:\/\/js\.tudouui\.com\/.*PortalPlayer[^\.]*\.swf/i,
		replace: localflag ? getUrl('swf/tudou.swf') : baesite[2] + 'tudou.swf',
		extra: "adkillrule"
	},{
		name: "tudou_olc",
		find: /^http:\/\/js\.tudouui\.com\/.*olc[^\.]*\.swf/i,
		replace: baesite[2] + 'olc_8.swf',
		extra: "adkillrule"
	},{
		name: "tudou_sp",
		find: /^http:\/\/js\.tudouui\.com\/.*SocialPlayer[^\.]*\.swf/i,
		replace: baesite[2] + 'sp.swf',
		extra: "adkillrule"
	},{
		name: "letv",//http://www.letv.com/ptv/vplay/2116819.html(viki)
		find: /^http:\/\/.*letv[\w]*\.com\/.*\/(?!(Live|seed|Disk|SSDK))((S[\w]{2,3})?(?!Live)[\w]{4}|swf|VLetv)Player[^\.]*\.swf/i,
		//find: /^http:\/\/.*letv[\w]*\.com\/.*\/(?!(Live|seed))((S[\w]{2,3})?(?!live)[\w]{4}|swf)Player[^\.]*\.swf/i,
		replace:  localflag ? getUrl('swf/letv.swf') : baesite[2] + 'letv.swf',
		extra: "adkillrule"
	},{
		name: "duowan",
		find: /http:\/\/assets\.dwstatic\.com\/.*\/vppp?\.swf/i,
		replace: "http://yuntv.letv.com/bcloud.swf",
		//replace: localflag ? getUrl('swf/letv0225.swf') : baesite[2] + 'letv0225.swf',
		extra: "adkillrule"
	},{
		name:"letvskin",
		find: /http:\/\/.*letv[\w]*\.com\/p\/\d+\/\d+\/(?!15)\d*\/newplayer\/\d+\/S?SLetvPlayer\.swf/i,
		replace: "http://player.letvcdn.com/p/201407/24/15/newplayer/1/SSLetvPlayer.swf",
		extra: "adkillrule"
	},{
		name: "pplive",
		find: /^http:\/\/player\.pplive\.cn\/ikan\/.*\/player4player2\.swf/i,
		replace: localflag ? getUrl('swf/pplive.swf') : baesite[2] + 'pplive.swf',
		extra:"adkillrule"
	},{
		name:"pplive_live",
		find: /^http:\/\/player\.pplive\.cn\/live\/.*\/player4live2\.swf/i,
		replace: localflag ? getUrl('swf/pplive_live.swf') : baesite[2] + 'pplive_live.swf',
		extra: "adkillrule"
	},{
		name: "iqiyi",
		find: /^https?:\/\/www\.iqiyi\.com\/(player\/(\d+\/Player|[a-z0-9]*)|common\/flashplayer\/\d+\/((PPS)?Main|Share)?Player[^\.]*)\.swf/i,
		replace: localflag ? getUrl('swf/iqiyi5.swf') : baesite[2] + 'iqiyi5.swf',
		extra: "adkillrule"
	},{
		name:"pps",
		find: /^https?:\/\/www\.iqiyi\.com\/player\/cupid\/.*\/pps[\w]+.swf/i,
		replace: localflag ? getUrl('swf/pps.swf') : baesite[1] + 'pps.swf',
		extra:"adkillrule"
	},{
		name: "sohu_live",
		find: /http:\/\/(tv\.sohu\.com\/upload\/swf\/(?!ap).*\d+|(\d+\.){3}\d+(:\d+)?\/.*player)\/(Main|PlayerShell)[^\.]*\.swf/i,
		replace:  localflag ? getUrl('swf/sohu/sohu_live.swf') : baesite[2] + 'sohu_live.swf',
		extra: "adkillrule"
	},{
		name:"17173",
		find:/^http:\/\/f\.v\.17173cdn\.com\/(\d+\/)?flash\/PreloaderFile(Customer)?\.swf/i,
		replace: localflag ? getUrl('swf/17173/17173.in.Vod.swf') : baesite[2] + '17173.in.Vod.swf',
		extra:"adkillrule"
	},{
		name:"17173_out",
		find:/^http:\/\/f\.v\.17173cdn\.com\/(\d+\/)?flash\/PreloaderFileFirstpage\.swf/i,
		replace: localflag ? getUrl('swf/17173/17173.out.Vod.swf') : baesite[2] + '17173.out.Vod.swf',
		extra:"adkillrule"
	},{
		name:"17173_live",
		find:/^http:\/\/f\.v\.17173cdn\.com\/(\d+\/)?flash\/Player_stream(_firstpage)?\.swf/i,
		replace: localflag ? getUrl('swf/17173/17173.in.Live.swf') : baesite[2] + '17173.in.Live.swf',
		extra:"adkillrule"
	},{
		name:"17173_live_out",
		find:/^http:\/\/f\.v\.17173cdn\.com\/(\d+\/)?flash\/Player_stream_customOut\.swf/i,
		replace: localflag ? getUrl('swf/17173/17173.out.Live.swf') : baesite[2] + '17173.out.Live.swf',
		extra:"adkillrule"
	},{
		name: "letv_live",//此为临时规则，失效删除！
		find: /http:\/\/(ark|fz)\.letv\.com\/.*/i,
		replace: "about:blank",
		extra: "adkillrule"
	},{
		name: "pps_live",//此为临时规则，貌似已失效（仅做保留）！20141215pps直播已自动转向iqiyi直播。
		find: /http:\/\/www\.iqiyi\.com\/common\/.*\/am[^\.]*.swf/i,
		replace: "about:blank",
		extra: "adkillrule"
	},{
		name: "ppslive",//临时规则，免pps跳转iqiyi直播。
		find: /http:\/\/live\.pps\.tv(?!(\/index.php))/i,
		replace: "http://live.pps.tv/index.php/epg/show",
		extra: "adkillrule"
	}
];

//Referer修改规则
/*格式：
	name:规则名称
	find:匹配(正则)表达式
	replace:替换(正则)表达式,注意此处有多种方式,可看后续说明并按需选择
	extra:额外的属性,remove表示去除Referer参数
*/
var refererslist = [{
		name: "referer_youku",
		find: /f\.youku\.com/i,
		replace: "http://player.youku.com/player.php",
		extra: ""	//use "remove" is also acceptable
	},{
		name: "referer_56",
		find: /\.56\.com/i,
		replace: "",
		extra: "remove"
	},{
		name: "referer_iqiyi",
		find: /cache\.video\.qiyi\.com/i,
		replace: "",
		extra: "remove"
	}
]

//Crossdomain修改规则
/*格式：
	name:规则名称
	find:匹配(正则)表达式,当出现匹配地址时,启动crossdomain代理修改
	monitor:匹配(正则)表达式,当出现匹配地址时,释放crossdomain代理(接收完成后)
	extra:额外的属性,crossdomain表示启动修改
*/
var proxylist = [{
		name: "crossdomain_youku",
		find: /http:\/\/static\.youku\.com\/.*(q?player|loaders?|\w{13})[^\.]*\.swf/i,	//播放器载入地址
		monitor:/http:\/\/v\.youku\.com\/crossdomain\.xml/i,	//youku tudou实际访问的均是这个地址
		extra: "crossdomain"
	},{
		name: "crossdomain_tudou",
		find: /.*PortalPlayer[^\.]*\.swf/i,
		exfind: /http:\/\/v\.youku\.com\/crossdomain\.xml/i,
		monitor: /http:\/\/www\.tudou\.com\/crossdomain\.xml/i,
		extra: "crossdomain"
	},{
		name: "crossdomain_tudou_sp",
		find: /.*olc[^\.]*\.swf/i,
		exfind: /http:\/\/v\.youku\.com\/crossdomain\.xml/i,
		monitor: /http:\/\/www\.tudou\.com\/crossdomain\.xml/i,
		extra: "crossdomain"
	},{
		name: "crossdomain_sohu",
		find: /http:\/\/(tv\.sohu\.com\/|(\d+\.){3}\d+(:\d+)?).*\/(Main|PlayerShell)[^\.]*\.swf/i,
		monitor: /http:\/\/(photocdn|live\.tv)\.sohu\.com\/crossdomain\.xml/i,
		extra: "crossdomain"
	},{
		name: "crossdomain_iqiyi|pps-1",
		find: /https?:\/\/www\.iqiyi\.com\/(player\/(\d+\/Player|[a-z0-9]*|cupid\/.*\/(pps[\w]+|clear))|common\/flashplayer\/\d+\/((PPS)?Main|Share)?Player[^\.]*)\.swf/i,
		//monitor: /notavailable/i,
		monitor: /\w{32}\.\w{3}.*qyid=\w{32}.*ran=\d+/i,
		extra: "crossdomain"
	},{
		name: "crossdomain_iqiyi|pps-2",
		find: /https?:\/\/www\.iqiyi\.com\/player\/cupid\/common\/icon\.swf/i,
		monitor: /notavailable/i,
		//monitor: /http:\/\/sf\.video\.qiyi\.com\/crossdomain\.xml/i,
		extra: "crossdomain"
	},{
		name: "crossdomain_iqiyi|pps-main",
		find: /https?:\/\/.*(iqiyi|pps)\.com\/.*\.htm/i,
		exfind: /\w{32}\.\w{3}.*qyid=\w{32}.*ran=\d+/i,
		monitor: /policy\.video\.iqiyi\.com\/crossdomain\.xml/i,
		//monitor: /.*\/(vodpb\.gif\?url|adpb\.gif\?pbtp=show)/i,
		extra: "crossdomain"
	}
]

@echo off
color 2E
pushd "%~dp0"
set urlT=noads.aliapp.com/swf/
rem set urlT=noads.mujj.us/swf/
set urlT1=code.taobao.org/svn/noadsplayer/trunk/Adkill_Player_Offline/

:up
echo       为避免错误，正在下载最新updateSWF.bat文件……&&echo.&&del/q updateSWF.bat&&wget -N -c %urlT1%updateSWF.bat
if exist updateSWF.bat (call updateSWF.bat&&exit) else cls&&echo.&&echo 》连接默认服务器失败，换个服务器试试？任意键进入……&&pause>nul&&cls&&goto menu

:swf

::youku
wget -N -c -P ./swf/ %urlT%loader.swf
wget -N -c -P ./swf/ %urlT%player.swf

::ku6
wget -N -c -P ./swf/ %urlT%ku6.swf
wget -N -c -P ./swf/ %urlT%ku6_out.swf

::iqiyi&pps
wget -N -c -P ./swf/ %urlT%iqiyi_out.swf
wget -N -c -P ./swf/ %urlT%iqiyi5.swf
wget -N -c -P ./swf/ %urlT%iqiyi.swf
wget -N -c -P ./swf/ %urlT%pps.swf

::tudou
wget -N -c -P ./swf/ http://code.taobao.org/svn/noadsplayer/trunk/Player/tudou.swf
rem wget -N -c -P ./swf/ %urlT%tudou.swf
rem wget -N -c -P ./swf/ %urlT%olc_8.swf
rem wget -N -c -P ./swf/ %urlT%sp.swf

::letv
wget -N -c -P ./swf/ %urlT%letv.swf
wget -N -c -P ./swf/ %urlT%letv0225.swf
rem wget -N -c -P ./swf/ http://player.letvcdn.com/p/201403/05/1456/newplayer/1/SLetvPlayer.swf

::pplive
wget -N -c -P ./swf/ %urlT%pplive.swf
wget -N -c -P ./swf/ %urlT%pplive_live.swf

::sohu
wget -N -c -P ./swf/sohu/ %urlT%sohu.swf
wget -N -c -P ./swf/sohu/ %urlT%sohu_live.swf
wget -N -c -P ./swf/sohu/otherCore/ %urlT%otherCore/PLVideoCore.swf
wget -N -c -P ./swf/sohu/panel/ %urlT%panel/SettingPanel.swf

::17173
wget -P ./swf/17173/ -N -c %urlT%17173.in.Vod.swf
wget -P ./swf/17173/ -N -c %urlT%17173.in.Live.swf
wget -P ./swf/17173/ -N -c %urlT%17173.out.Vod.swf
wget -P ./swf/17173/ -N -c %urlT%17173.out.Live.swf
wget -P ./swf/17173/ -N -c %urlT%FilePlayer.swf
wget -P ./swf/17173/ -N -c %urlT%StreamPlayer.swf
wget -P ./swf/17173/ -N -c %urlT%Gifts.swf
wget -P ./swf/17173/ -N -c %urlT%ST.swf
cls
echo       已通过国内服务器更新指定swf文件，请重启浏览器看看是否解决您的问题？&&pause>nul&&exit

:menu
echo.
echo                    视频播放器及规则更新脚本
echo.
echo   ================================================================
echo.
echo   1、重试:重新从默认服务器下载最新相关文件进行更新！
echo.
echo   2、换服务器:默认服务器挂了?使用糖醋咖啡的来临时更新swf文件吧（仅更新swf）！
echo.
echo   e、反馈:以上都不给力，伤心啦！要反馈选这个，否则直接X掉退出吧。
echo   ================================================================
echo.

set /p id= 》》请输入相应序号选择，按回车键执行:
cls

if "%id%"=="1" goto up
if "%id%"=="2" goto swf
if "%id%"=="e" goto exit

:err
cls
echo.
echo       对不起，你的输入有误，请按任意键重新输入！
pause>nul

:exit
start "" http://bbs.kafan.cn/thread-1514537-1-1.html &&exit
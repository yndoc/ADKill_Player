
@echo off
color 2E
pushd "%~dp0"
set urlC=haoutil.googlecode.com/svn/trunk/player/
set urlM=code.taobao.org/svn/noadsplayer/trunk/Player/
set urlT=noads.aliapp.com/swf/
rem set urlT=noads.mujj.us/swf/
set urlT1=code.taobao.org/svn/noadsplayer/trunk/Adkill_Player_Offline/
set urlP=127.0.0.1:8087
cls
echo    ============================================
echo    #               更新注意！！               #
echo    ============================================
rem echo   本次更新将删除letv0225.swf及sohu多余文件！修复40版本BUG。
echo   自Chrome39版本后，扩展增加了验证机制!
echo   请39及以上版本用户转向ADFree新版。
echo   这就是说，使用Bat文件更新后扩展将提示损坏需要修复。
echo   目前这种验证机制不明,无法绕过！
echo   请39及以上版本用户转向ADFree新版（再次说明！）。
echo   任意键继续……
echo   --------------------------------------------
rem echo   需要升级内置update文件，正在升级~
rem del/q update.bat&&wget -N %urlT1%update.bat&&cls
rem if exist update.bat echo.&&echo     内置update文件升级成功！
pause>nul

:Select
cls
echo.
echo                    视频播放器及规则更新脚本
echo.
echo   本脚本用于下载及更新扩展相关脚及swf类播放器文件
echo.
echo   请配合Adkill Player Offline商店版使用！！
echo   并请选择以下同一选项运行两次以确保更新成功
echo   ================================================================
echo.
echo   0、更新扩展脚本相关文件(不含swf文件！)
echo.
echo   1、不使用代理直接更新SWF播放器(gcode地址,最新！)
echo.
echo   2、使用代理更新SWF播放器(必须先运行goagent代理客户端)
echo.
echo   3、使用备用地址(国内)更新播放器(可能未同步更新)
echo.
echo   4、为update.bat创建桌面快捷方式(方便自助更新)
echo.
echo   e、退出此批处理（同时清理临时文件）。
echo   ================================================================
echo.

set /p id= 》》请输入相应序列号字母，按回车键执行:
cls

if "%id%"=="0" goto js
if "%id%"=="1" goto http
if "%id%"=="2" goto proxy
if "%id%"=="3" goto bakswf
if "%id%"=="4" goto lnk
if "%id%"=="e" goto exit
:err
cls
echo.
echo       对不起，你的输入有误，请按任意键重新输入！
pause>nul
goto Select

:================================================================================
:js
del/q *.js popup.html
wget -N %urlT1%function.js
wget -N %urlT1%rulelist.js
wget -N %urlT1%popup.js
wget -N %urlT1%popup.html
rem wget -N %urlT1%manifest.json
rem wget -N %urlT1%script.js

echo   正在查找并删除letv0225.swf和sohu.swf多余文件......
if exist ".\swf\letv0225.swf" (del /q/s ".\swf\letv0225.swf">nul)
if exist ".\swf\sohu.swf" (del /q/s ".\swf\sohu.swf">nul)
echo.
echo   文件已删除！
echo   所有脚本更新已完成！请重启浏览器使用，按任意键返回！！&&pause>nul
goto :Select

:http

::youku
wget -N -P ./swf/ %urlC%testmod/loader.swf
wget -N -P ./swf/ %urlC%testmod/player.swf

::ku6 //该播放器许久未更新，停止下载！
wget -N -P ./swf/ %urlT%ku6.swf
wget -N -P ./swf/ %urlT%ku6_out.swf

::iqiyi&pps
wget -N -P ./swf/ %urlC%testmod/iqiyi_out.swf
wget -N -P ./swf/ %urlC%testmod/iqiyi5.swf
wget -N -P ./swf/ %urlC%testmod/iqiyi.swf
wget -N -P ./swf/ %urlC%testmod/pps.swf

::tudou
wget -N -P ./swf/ %urlC%testmod/tudou.swf
rem wget -N -P ./swf/ %urlC%testmod/olc_8.swf
rem wget -N -P ./swf/ %urlC%testmod/sp.swf

::letv
wget -N -P ./swf/ %urlC%testmod/letv.swf
rem wget -N -P ./swf/ %urlT%letv0225.swf
rem wget -N -P ./swf/ http://player.letvcdn.com/p/201403/05/1456/newplayer/1/SLetvPlayer.swf

::pplive
wget -N %urlT%pptv.in.Ikan.swf -O pplive.swf
wget -N %urlT%pptv.in.Live.swf -O pplive_live.swf
move pplive*.swf ./swf/

::sohu
wget -N -P ./swf/sohu/ %urlC%testmod/sohu.swf
wget -N -P ./swf/sohu/ %urlC%testmod/sohu_live.swf
wget -N -P ./swf/sohu/otherCore/ %urlT%otherCore/PLVideoCore.swf
wget -N -P ./swf/sohu/panel/ %urlT%panel/SettingPanel.swf

goto 17173
::======================================================================
:proxy

::iqiyi
wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/iqiyi.swf
wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/iqiyi_out.swf
wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/iqiyi5.swf
wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/pps.swf

::letv
wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/letv.swf
rem wget -N -P ./swf/ %urlT%letv0225.swf


:youku
wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/player.swf
wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/loader.swf

::tudou
wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/tudou.swf
rem wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/olc_8.swf
rem wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/sp.swf

::ku6 //改播放器许久未更新，停止下载！
rem wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/ku6.swf
rem wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%ku6_out.swf

::pplive
wget -N %urlT%pptv.in.Ikan.swf -O pplive.swf
wget -N %urlT%pptv.in.Live.swf -O pplive_live.swf
move pplive*.swf ./swf/
rem wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%pplive.swf
rem wget --no-check-certificate -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%pplive_live.swf

::sohu
rem wget -P ./swf/sohu/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/sohu.swf
wget --no-check-certificate -P ./swf/sohu/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/sohu_live.swf
wget -N -P ./swf/sohu/otherCore/ %urlT%otherCore/PLVideoCore.swf
wget -N -P ./swf/sohu/panel/ %urlT%panel/SettingPanel.swf

::other
rem wget -P ./swf/ -N -t 3 -e "https_proxy=http://%urlP%" https://%urlC%testmod/empty.bin

goto 17173

::=======================================================================
:bakswf

::youku
wget -N -P ./swf/ %urlT%loader.swf
wget -N -P ./swf/ %urlT%player.swf

::ku6
wget -N -P ./swf/ %urlT%ku6.swf
wget -N -P ./swf/ %urlT%ku6_out.swf

::iqiyi&pps
wget -N -P ./swf/ %urlT%iqiyi_out.swf
wget -N -P ./swf/ %urlT%iqiyi5.swf
wget -N -P ./swf/ %urlT%iqiyi.swf
wget -N -P ./swf/ %urlM%pps.swf

::tudou
wget -N -P ./swf/ %urlM%tudou.swf
rem wget -N -P ./swf/ %urlT%tudou.swf
rem wget -N -P ./swf/ %urlT%olc_8.swf
rem wget -N -P ./swf/ %urlT%sp.swf

::letv
wget -N -P ./swf/ %urlT%letv.swf
rem wget -N -P ./swf/ %urlT%letv0225.swf
rem wget -N -P ./swf/ http://player.letvcdn.com/p/201403/05/1456/newplayer/1/SLetvPlayer.swf

::pplive
wget -N %urlT%pptv.in.Ikan.swf -O pplive.swf
wget -N %urlT%pptv.in.Live.swf -O pplive_live.swf
move /y pplive*.swf ./swf/

::sohu
rem wget -N -P ./swf/sohu/ %urlT%sohu.swf
wget -N -P ./swf/sohu/ %urlT%sohu_live.swf
wget -N -P ./swf/sohu/otherCore/ %urlT%otherCore/PLVideoCore.swf
wget -N -P ./swf/sohu/panel/ %urlT%panel/SettingPanel.swf

:17173
wget -P ./swf/17173/ -N %urlT%17173.in.Vod.swf
wget -P ./swf/17173/ -N %urlT%17173.in.Live.swf
wget -P ./swf/17173/ -N %urlT%17173.out.Vod.swf
wget -P ./swf/17173/ -N %urlT%17173.out.Live.swf
wget -P ./swf/17173/ -N %urlT%FilePlayer.swf
wget -P ./swf/17173/ -N %urlT%StreamPlayer.swf
wget -P ./swf/17173/ -N %urlT%Gifts.swf
wget -P ./swf/17173/ -N %urlT%ST.swf

echo       所有swf播放器更新完成，请重启浏览器使用！任意键返回主菜单……&&pause>nul
goto :Select

:lnk
mshta VBScript:Execute("Set a=CreateObject(""WScript.Shell""):Set b=a.CreateShortcut(a.SpecialFolders(""Desktop"") & ""\ADkill自助更新.lnk""):b.TargetPath=""%~dp0update.bat"":b.WorkingDirectory=""%~dp0"":b.Save:close")
echo  创建快捷方式完成！任意键返回主菜单……&&pause>nul
goto :Select

:exit
del %0&&exit

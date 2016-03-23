title: 如何合理使用网络
date: 2016-01-09
tags: Lantern
---

 介绍使用网络的两种不同姿势， Lantern & Tor。 Lantern 主要目的用于突破网络内容封锁，而 Tor 更注重匿名或传输安全性。


<!--more-->


### 姿势1: Lantern

Lantern 是一款开源并且跨平台的翻墙工具。蓝灯是它的中文名。


#### [下载][1]与安装

当前蓝灯同时提供三大桌面操作系统（Windows、Linux、Mac）的安装包。

安装后，蓝灯默认会在【本机地址】上开启一个 HTTP 代理的端口，端口号是 8787

```
127.0.0.1:8787
<!-- 配置文件 -->
http://127.0.0.1:16823/proxy_on.pac

```

#### 启动与退出

安装之后，你可以通过“开始菜单”或者“桌面上的图标”，来启动蓝灯。然后在任务栏的“托盘区”会出现一个蓝灯的图标；同时，它还会自动弹出系统默认的浏览器，在浏览器上显示它的主界面 `http://127.0.0.1:16823/`，这个主界面很简单。

如果你想退出，在任务栏的“托盘区图标”点右键，弹出的“快捷菜单”上会有退出的选项。


#### 配置浏览器代理，以 chrome 为例

- 首先装一个代理插件，这里推荐 [SwitchyOmega][2]
- 点击插件图标 -> 选项 -> 新建情景模式 -> PAC情景模式
- 填写名称，将 `http://127.0.0.1:16823/proxy_on.pac` 下载后的脚本贴进去保存
- 选择刚才填写的代理

至此，可在 `chrome` 下方便地访问 `google、youtube` 等


### 姿势2: Tor + Meek

Tor 是 The Onion Router 的缩写，中文又称“洋葱网络/洋葱路由”。
它是一款非常老牌的翻墙工具；而且它不仅仅可以翻墙，还是一款很牛B 的隐匿性工具（有助于在你上网时，帮你隐匿自己的真实公网 IP）。
支持 Windows、Linux、Mac OX 三大平台，同时支持多种语言，包括中文。

[官网][5] 选择对应的平台下载


**两种使用方式**


####1. Tor in a command line

mac 为例

**install Tor**

- install [Homebrew][13]: The missing package manager for OS X
- run: brew install tor


**配置文件**

Tor 的配置文件模板路径 `/opt/local/etc/tor/torrc.sample`，去掉 `.sample` 使其生效


```
cd /opt/local/etc/tor
cp torrc.sample torrc

```


Documentation, including links to installation and setup instructions:
        https://www.torproject.org/docs/documentation.html

Making applications work with Tor:
        https://wiki.torproject.org/projects/tor/wiki/doc/TorifyHOWTO



####2. Simply use [Tor Browser Bundle][12]

这个软件包捆绑了 Firefox 浏览器（对于2.3.25之后的版本，监听端口改为9150，其他的9050）

第一次启动 `TOR Browser`，需要作一些配置让它走 meek 类型的网桥。

step 1:

![img](http://7xpby6.com1.z0.glb.clouddn.com/step1.png)

step 2:

![img](http://7xpby6.com1.z0.glb.clouddn.com/step2.png)

step 3:

![img](http://7xpby6.com1.z0.glb.clouddn.com/step3.png)

step 4:

![img](http://7xpby6.com1.z0.glb.clouddn.com/step4.png)


step 5:

![img](http://7xpby6.com1.z0.glb.clouddn.com/step5.png)



**场景1: 不想依赖内置的 Firefox，直接启动 TOR（以及 meek 插件），只拿 TOR 来充当翻墙代理**

步骤如下：

1. 正常启动并配置好 meek 插件
2. 自定义启动脚本


配置跟前面第一次启动时一样。

mac 下的启动脚本

```
#!/bin/bash

cd /Applications/TorBrowser.app/TorBrowser/Tor
./tor.real --defaults-torrc /Applications/TorBrowser.app/TorBrowser/Data/Tor/torrc-defaults -f /Applications/TorBrowser.app/TorBrowser/Data/Tor/torrc DataDirectory /Applications/TorBrowser.app/TorBrowser/Data/Tor GeoIPFile /Applications/TorBrowser.app/TorBrowser/Data/Tor/geoip GeoIPv6File /Applications/TorBrowser.app/TorBrowser/Data/Tor/geoip6

```


Windows 脚本如下，保存成 .bat  文件，放到安装目录下，与  `TorBrowser` 目录同级

```
<!-- Windows -->
.\TorBrowser\Tor\tor.exe --defaults-torrc .\TorBrowser\Data\Tor\torrc-defaults -f .\TorBrowser\Data\Tor\torrc DataDirectory .\TorBrowser\Data\Tor GeoIPFile .\TorBrowser\Data\Tor\geoip GeoIPv6File .\TorBrowser\Data\Tor\geoip6

```

其他平台类似操作。



**场景2: 共享 TOR Browser 的翻墙通道**

找到配置文件 `torrc`，在末尾加上以下一行，重启 TOR Browser。另外，防火墙的配置要允许 9150 端口的 TCP 连入。

```
SocksListenAddress 0.0.0.0:9150

```


**配置浏览器代理**

```
SOCKS5 127.0.0.1:9150
```



### 参考





[1]:https://getlantern.org/ "Lantern download"
[2]:https://github.com/FelisCatus/SwitchyOmega "SwitchyOmega"
[3]:https://program-think.blogspot.com/2014/10/gfw-tor-meek.html "Tor + Meek"
[4]:https://program-think.blogspot.com/2015/08/gfw-lantern.html "Lantern Guide"
[5]:https://www.torproject.org/ "Tor Official"
[6]:http://macserve.org.uk/projects/issh/ "issh"
[7]:https://www.torproject.org/docs/tor-doc-osx.html.en "tor install"
[8]:http://www.vpngate.net/cn "vpngate"
[9]:http://www.ishadowsocks.com/ "ishadowsocks free"
[10]:https://github.com/getlantern/lantern "lantern github"
[11]:https://www.macports.org/install.php "port install"
[12]:https://www.torproject.org/projects/torbrowser.html.en#downloads "torbrowser"
[13]:http://brew.sh/ "Homebrew"

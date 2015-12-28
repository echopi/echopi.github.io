title: 如何合理使用网络
---

## summary

 介绍如何利用开源项目合理使用网络。


### Lantern

Lantern 是一款开源并且跨平台的翻墙工具。蓝灯是它的中文名。


#### [下载][1]与安装

当前蓝灯同时提供三大桌面操作系统（Windows、Linux、Mac）的安装包。

安装后，蓝灯默认会在【本机地址】上开启一个 HTTP 代理的端口，端口号是 8787

```
127.0.0.1:8787

// 配置文件
http://127.0.0.1:16823/proxy_on.pac

```

#### 启动与退出

安装之后，你可以通过“开始菜单”或者“桌面上的图标”，来启动蓝灯。然后在任务栏的“托盘区”会出现一个蓝灯的图标；同时，它还会自动弹出系统默认的浏览器，在浏览器上显示它的主界面 (http://127.0.0.1:16823/)，这个主界面很简单。

如果你想退出，在任务栏的“托盘区图标”点右键，弹出的“快捷菜单”上会有退出的选项。


#### 配置浏览器代理，以 chrome 为例

- 首先装一个代理插件，这里推荐 [SwitchyOmega][2]
- 点击插件图标 -> 选项 -> 新建情景模式 -> PAC情景模式
- 填写名称，将 http://127.0.0.1:16823/proxy_on.pac 下载后的脚本贴进去保存







### Tor + Meek

Tor 是 The Onion Router 的缩写，中文又称“洋葱网络/洋葱路由”。
它是一款非常老牌的翻墙工具；而且它不仅仅可以翻墙，还是一款很牛B 的隐匿性工具（有助于在你上网时，帮你隐匿自己的真实公网 IP）。
支持 Windows、Linux、Mac OX 三大平台，同时支持多种语言，包括中文。


#### 下载与安装

[官网][5]选择对应的平台下载


**Install Tor for Mac**




- [install port][7]
- run: sudo port install tor

In a Termnal window, run: sudo port install tor


You will find a sample Tor configuration file at /opt/local/etc/tor/torrc.sample. Remove the .sample extension to make it effective.

Tor Browser Bundle

这个软件包捆绑了 Firefox 浏览器（对于2.3.25之后的版本，监听端口改为9150，其他的9050）

#### 配置




### 参考





[1]:https://getlantern.org/ "Lantern download"
[2]:https://github.com/FelisCatus/SwitchyOmega "SwitchyOmega"
[3]:https://program-think.blogspot.com/2014/10/gfw-tor-meek.html "Tor + Meek"
[4]:https://program-think.blogspot.com/2015/08/gfw-lantern.html "Lantern Guide"
[5]:https://www.torproject.org/ "Tor Official"
[6]:http://macserve.org.uk/projects/issh/ "issh"
[7]:https://www.torproject.org/docs/tor-doc-osx.html.en "port install"
[8]:http://www.vpngate.net/cn "vpngate"
[9]:http://www.ishadowsocks.com/ "ishadowsocks free"
[10]:https://github.com/getlantern/lantern "lantern github"


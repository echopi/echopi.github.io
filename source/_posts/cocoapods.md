title: CocoaPods
date: 2016-01-09
tags: iOS
---

CocoaPods 是使用 Ruby 实现的，可以通过 gem 命令来安装。MAC 中一般自带 Ruby 环境。


### 安装

建议将默认的 RubyGems 源替换为淘宝的 RubyGems 镜像

```
sudo gem sources -a https://ruby.taobao.org/
<!-- 亚马逊源 -->
sudo gem sources --remove https://rubygems.org/ 

gem sources -l

sudo gem update
sudo gem install cocoapods -v 0.35
<!-- 初始化 -->
pod setup

<!-- 卸载 -->
sudo gem uninstall cocoapods

```

pod setup在执行时，会等待比较久的时间。

这步其实是 Cocoapods 在将它的信息下载到 ~/.cocoapods目录下。

可以试着 cd 到那个目录，用du -sh *来查看下载进度.



### 添加 CocoaPods 源

```
pod repo remove master
pod repo add master CocoaPods 源
```

### 使用 CocoaPods

```
pod install 

pod update

```

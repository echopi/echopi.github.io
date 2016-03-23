title: NetEase-MusicBox 命令行版本
date: 2016-03-23 23:36:00
tags: music
---

刚开始看到这东西，我就感觉到我不是一个合格的程序员，玩这货的货，一定有自虐倾向。下一步我自己就默默 fork 了一个分支，毕竟看着有点 big 格，我也要装起来。

照着 [github][1] 上面的介绍捣鼓了一番，就是没跑起来，python2 pyhon3 不兼容导致的。踩过的坑，就得记下来。仅写了 mac 下的安装流程。



### 怎么办，没跑起来

Just do it!


1. 确保你使用的是 `python 2.x` 的版本，[python 多版本管理](2)可以参考
2. 确保 pip 已妥善安装 (pip is available on OS X via easy_install)
3. 安装 NetEase-MusicBox
4. 安装 mpg123 
5. musicbox
6. done

```sh
python --version
sudo easy_install pip
sudo pip install NetEase-MusicBox
brew install mpg123
```

[python2 pyhon3 差异][3] 请猛戳，卖个萌，我是大自然默默无闻的搬运工。



[1]:https://github.com/echopi/musicbox "musicbox"
[2]:https://github.com/yyuu/pyenv "pyenv"
[3]:https://www.zhihu.com/question/19698598 "python2 pyhon3"
[4]:http://stackoverflow.com/questions/17271319/installing-pip-on-mac-os-x "pip install"

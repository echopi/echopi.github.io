title: 使用 launchctl 实现定时任务
date: 2016-02-23
tags: launchctl
---

平台 mac

### 步骤

1.准备定时任务脚本

script.sh

比如我本地的 `Sublime Text` 定时同步任务脚本

```sh
#!/bin/bash
cd /Users/jiewei.ljw/Sublime
echo `date` >> git.log
git diff origin/master --name-only >> git.log
git add .
git commit -m "sync .."
git push

```

2.任务描述文件 plist

保存为 `com.gitsync.sublime.plist`


```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">  
<plist version="1.0">  
  <dict>
    <!-- 名称，要全局唯一 -->
    <key>Label</key>
    <string>com.gitsync.sublime</string>

    <!-- 要运行的程序， 如果省略这个选项，会把ProgramArguments的第一个
    元素作为要运行的程序 -->
    <key>Program</key>
    <string>/Users/jiewei.ljw/Sublime/script.sh</string>

    <!-- 命令， 第一个为命令，其它为参数-->
    <key>ProgramArguments</key>
    <array>
      <string>/Users/jiewei.ljw/Sublime/script.sh</string>
    </array>

    <!-- 运行间隔，与StartCalenderInterval使用其一，单位为秒 -->
    <!-- <key>StartInterval</key> -->
    <!-- <integer>30</integer> -->

    <!-- 每天的10:30执行 -->
    <key>StartCalendarInterval</key>
    <dict>
      <key>Minute</key>
      <integer>30</integer>
      <key>Hour</key>
      <integer>10</integer>
    </dict>
  </dict>  
</plist>
```

3.launchctl 加载 plist

系统定义了几个位置来存放任务列表

- ~/Library/LaunchAgents 由用户自己定义的任务项
- /Library/LaunchAgents 由管理员为用户定义的任务项
- /Library/LaunchDaemons 由管理员定义的守护进程任务项
- /System/Library/LaunchAgents 由Mac OS X为用户定义的任务项
- /System/Library/LaunchDaemons 由Mac OS X定义的守护进程任务项

为用户定义的任务项，只以用户登陆后才会执行，守护进程任务项无论用户是否登陆都会执行 

根据添加的任务类型，把它拷贝到相应的目录，通过launchctl来加载：


```sh
cp com.gitsync.sublime.plist ~/Library/LaunchAgents/

launchctl load ~/Library/LaunchAgents/com.gitsync.sublime.plist

```

### 其他常用命令

```sh
launchctl unload ~/Library/LaunchAgents/com.gitsync.sublime.plist
launchctl start  com.gitsync.sublime.plist
launchctl stop   com.gitsync.sublime.plist 
launchctl list
```


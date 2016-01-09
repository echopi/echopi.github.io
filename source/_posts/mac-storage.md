title: mac 超级大瘦身
date: 2016-01-09
tags: mac
---

最近系统一致出现存储不足的情况，在某个时间节点之后就一直有这个问题。

于是下了 [OmniDiskSweeper][2] 来看看系统存储详细，发现一个很大的文件夹 `.cleverfiles` 

这里瘦身只说一种情况，即到根目录下，执行 `ls al `, 如果没看到上面提的 `.cleverfiles`，节省时间，就看到这吧。


<!--more-->


### 关于 .cleverfiles

`.cleverfiles` 目录是 `Disk Drill` （一个数据备份软件）搞的鬼，一般都有几个 g 到几十个 g 的大小。


### Delete .cleverfiles

按 [官方的介绍][1] 卸载 `Disk Drill`，如果已经卸载了，确保以下文件已删除，否则按照介绍再卸载一次。

```
/Library/LaunchDaemons/com.cleverfiles.cfbackd.plist
/Library/Application Support/CleverFiles

```

打开 shell，执行

```
cd /
<!-- 需要超级权限 -->
sudo rm -rf .cleverfiles

done.
```


从此腰不酸了，腿也不疼了。


[1]:http://help.cleverfiles.com/how-to-uninstall-disk-drill/ "Disk Drill uninstall"
[2]:https://www.omnigroup.com/more "OmniDiskSweeper"


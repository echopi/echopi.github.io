title: port forwarding
date: 2015-12-28
tags: shell
---


### 端口转发

端口转发一般常常用于虚拟机与宿主机之间通信时使用。



### mac 配置端口转发

打开配置文件

```
sudo vim /etc/pf.conf

```

在 rdr-anchor "com.apple/*" 后面加上

```
rdr on lo0 inet proto tcp from any to 0.0.0.0 port 1234 -> 127.0.0.1 port 9150

```

> 发到 1234 端口的数据转发到 9150 端口


重新加载配置

```
sudo pfctl -f /etc/pf.conf

```

启动

```
sudo pfctl -e

```


### reference

- https://pleiades.ucsc.edu/hyades/PF_on_Mac_OS_X

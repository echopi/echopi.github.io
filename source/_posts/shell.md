title: 常用 shell 
---

### 端口相关

```
<!-- 查看监听的端口 -->
netstat -an | grep "LISTEN"

<!-- 端口被哪个进程占用 -->
lsof -i tcp:port
lsof -i :8787

```


###  端口转发

windows 平台

```
netsh interface portproxy add v4tov4 listenport=1027 listenaddress=0.0.0.0 connectaddress=127.0.0.1 connectport=9150 protocol=tcp

netsh interface portproxy delete v4tov4 listenport=1027 listenaddress=0.0.0.0

```


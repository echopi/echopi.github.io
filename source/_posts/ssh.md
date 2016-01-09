title: How to gen ssh keys
date: 2016-01-09
tags: ssh
---


### Generate keys

```
ssh-keygen -t rsa -b 4096 -C "your@mail.com"
```
### show public key

```
cat ~/.ssh/id_rsa.pub
```


### Add your key to the ssh-agent

```
<!-- Ensure ssh-agent is enabled: -->
eval "$(ssh-agent -s)"
<!-- Add your SSH key to the ssh-agent: -->
ssh-add ~/.ssh/id_rsa

```


### Copy your public key to the clipboard

```
<!-- window -->
clip < ~/.ssh/id_rsa.pub
<!-- mac -->
pbcopy < ~/.ssh/id_rsa.pub
<!-- Linux (requires xclip): -->
xclip -sel clip < ~/.ssh/id_rsa.pub

```


### Add to your account



### Test

```
ssh -T git@github.com

```

### 多 ssh 帐号

ssh 提供一种优雅且灵活的方式来解决多帐号的问题，通过用户自定义配置 `~/.ssh/config` 

```
Host    别名
    HostName  主机名
    Port            端口
    User           用户名
    IdentityFile  密钥文件的路径
```

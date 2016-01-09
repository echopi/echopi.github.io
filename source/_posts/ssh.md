title: How to gen ssh keys
date: 2016-01-09
tags: ssh
---


### generate keys

```
ssh-keygen -t rsa -b 4096 -C "your@mail.com"
```
### show public key

```
cat ~/.ssh/id_rsa.pub
```


### copy your public key to the clipboard

```
<!-- window -->
clip < ~/.ssh/id_rsa.pub
<!-- mac -->
pbcopy < ~/.ssh/id_rsa.pub
<!-- Linux (requires xclip): -->
xclip -sel clip < ~/.ssh/id_rsa.pub

```

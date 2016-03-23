title: ruby 多版本
date: 2016-02-22
tags: ruby
---




### intsall via brew (mac)

You need install [Homebrew] first.

brew update
brew install rbenv


### uninstall via brew

```
brew uninstall rbenv
```

### update via brew

```
brew update
brew upgrade rbenv ruby-build
```

### 常用命令


```
<!-- list all available versions: -->
rbenv install -l

<!-- install a Ruby version: -->
rbenv install 2.0.0-p247

<!-- Run this command after you install a new version of Ruby, or install a gem that provides commands -->
rbenv rehash

<!-- Displays the currently active Ruby version -->
rbenv version
<!-- Lists all Ruby versions known to rbenv -->
rbenv versions
```

### 参考资料

- [brew](1)
- [rbenv](2)
- [rvm](3)

[1]:http://brew.sh/ "brew"
[2]:https://github.com/rbenv/rbenv "rbenv"
[3]:https://github.com/rvm/rvm "rvm"

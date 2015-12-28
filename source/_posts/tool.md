title: something fucking awesome
---


## [oh-my-zsh][4]

> Oh My Zsh is a way of life!


- [终极 Shell -- ZSH][3]


```
<!-- configuration file -->
~/.zshrc

<!-- ls ur shells -->
cat /etc/shells

<!-- change ur default shell -->
chsh -s /bin/zsh

<!-- upgrade -->
upgrade_oh_my_zsh

<!-- uninstall  -->
uninstall_oh_my_zsh


```


## [github link][1]

navigate across files and packages on GitHub.com with ease


## [nvm][2]

Node Version Manager.

```
<!-- git install -->
git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`

<!-- afte installed,active nvm -->
. ~/.nvm/nvm.sh

<!-- ls local -->
nvm ls

<!-- ls remote -->
nvm ls-remote

<!-- install specific node -->
nvm install 5.3

<!-- use specific node -->
nvm use 5.3

<!-- where specific node installed -->
nvm which 5.3 

<!-- automatically sourced -->
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

```






[1]:https://github.com/github-linker/chrome-extension "github linker"
[2]:https://github.com/creationix/nvm "nvm"
[3]:http://zhuanlan.zhihu.com/mactalk/19556676 "zsh introduction"
[4]:https://github.com/robbyrussell/oh-my-zsh "oh-my-zsh "
 

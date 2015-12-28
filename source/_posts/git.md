title: git 基本技能
---


## 将代码库某分支退回到以前的某个commit id

- 场景：代码库需要回滚到某一个commit
- 原理：先将本地分支退回到某个commit，删除远程分支，再重新push本地分支

1. 本地代码库回滚

```
git reset --hard commit-id //回滚到commit-id，讲commit-id之后提交的commit都去除

git reset --hard HEAD~3 //将最近3次的提交回滚
```

2. 远程代码库回滚

操作步骤

```
git checkout the_branch
git pull
git branch the_branch_backup //备份一下这个分支当前的情况
git reset --hard the_commit_id //把the_branch本地回滚到the_commit_id
git push origin :the_branch //删除远程 the_branch
git push origin the_branch //用回滚后的本地分支重新建立远程分支
git push origin :the_branch_backup //如果前面都成功了，删除这个备份分支
```

[参考](https://git-scm.com/book/en/v2)



## 命令



### 不常用命令

```
<!-- where is .git  -->
git rev-parse --git-dir

<!-- 查看符号引用指向的引用 -->
git symbolic-ref HEAD

<!-- 查看本地仓库中的所有引用 -->
git show-ref

<!-- 使用 gitcat-file 查看对象时, 也可以通过指定引用或符号引用查看对象 -->
git cat-file -p HEAD

```





### 常用操作

** 修改最后一次提交，最终只是产生一个提交 **

- git commit -m 'comment'
- git add forgotten_file if necessary
- git commit --amend



** 取消已经暂存的文件 **

- git status,u see something like Changes to be committed
- git reset HEAD <file>... , files need to unstage



** 取消对文件的修改 **

- git checkout -- <file> , nothing changed in the file
- 或者使用 git stash 缓存本地更改，使用 git stash pop 来恢复



** 查看当前的远程库 **

- git remote -v
- -v is --verbose



** 从远程仓库抓取数据 **

- git fetch [remote-name]



** 推送数据到远程仓库 **

- git push origin master


** 远程仓库的删除和重命名 **

- git remote rename r1 r2
- git remote rm r2

```
$ git remote rename pb paul
$ git remote
origin
paul


$ git remote rm paul
$ git remote
origin

```

**其他**

```
git rebase
```


### 标签

- https://git-scm.com/book/zh/v1/Git-%E5%9F%BA%E7%A1%80-%E6%89%93%E6%A0%87%E7%AD%BE



[1]:https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash "git-completion.bash"



### 自动补全

如果你用的是 Bash shell，可以试试看 Git 提供的自动补全脚本。下载 Git 的源代码，进入 contrib/completion 目录，会看到一个 git-completion.bash 文件。将此文件复制到你自己的用户主目录中（译注：按照下面的示例，还应改名加上点：cp git-completion.bash ~/.git-completion.bash），并把下面一行内容添加到你的 .bashrc 文件中：

```
source ~/.git-completion.bash

```

### 运行某个外部命令

不过有时候我们希望运行某个外部命令，而非 Git 的子命令，这个好办，只需要在命令前加上 ! 就行。

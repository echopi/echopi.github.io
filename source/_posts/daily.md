title: 待整理
---


### math

- matrix67: http://www.matrix67.com/blog/page/2



### noting
- godaddy: https://www.godaddy.com/domains/searchresults.aspx?ci=83269&checkAvail=1&domainToCheck=pig


### bash

- 高效 bash: http://ahei.info/bash.htm
- :( ) { :| :&};:
- type  这个内置命令比which强大多了, 可以查找别名、函数、内置命令
- Here Strings
- Here Documents
- ssh的免认证登录: http://ahei.info/ssh-copy-id.htm




### [[]]和[]的区别
- [[]]内不进行单词分割和路径扩展, 所以 $a = ab 是可以的. []内则进行所有的扩展, [ $a = ab ]是不保险的.
- [[]]内的<>是用当前locale做字符串比较的, []内的<>是根据ASCII顺序做比较的, 2者都不是对数字进行比较的, 这个需要注意, 比如可以试试 3 > 11 ; echo $?, 是不是返回0? 另外, [只是内置的命令, 所以不能直接[ 3 < 2 ], 这样的话, <是元字符, 当作重定向符号了, 需要对<进行转义, 需要这样 [ 3 "<" 2 ]
- [[]]的==、!=、=~确实是正则匹配的, 具体用法可以见bash man


```
type ll
# ll is aliased to `ls -lGaf'

# 比较两个目录dir1和dir2中的文件有啥不同
diff <(ls dir1) <(ls dir2)


# Here Strings
grep a <<< abc


# Here Documents
grep a << EOF
asdf
qweszd
asdf
EOF


echo $((9 + 8 * 9))
81

echo $((9 + 8 ** 9))
134217737


${parameter}, 就是取出parameter的值, 有很多形式:
${parameter:offset}
${parameter:offset:length}

对parameter进行substr
${parameter#word}
${parameter##word}

删掉匹配的前缀
${parameter%word}
${parameter%%word}

删掉匹配的后缀


命令替换

$(command) 或者`command`, 把command的输出做为结果

```






### shell script

- try starting a README file with a #!/bin/cat, and making it executable. The result is a self-listing documentation file
- \#!/bin/rm \# Self-deleting script.
- This fails because, for security reasons, the current directory (./) is not by default included in a user's $PATH. It is therefore necessary to explicitly invoke the script in the current directory with a ./scriptname.
- [Advanced Bash-Scripting Guide][1]
- [bash readline guide][3]
- base64_charset=( {A..Z} {a..z} {0..9} + / = )


### examples

```
# special char [:]
# This is the shell equivalent of a "NOP" (no op, a do-nothing operation)

while :
do
   operation-1
   operation-2
   ...
   operation-n
done

# Same as:
#    while true
#    do
#      ...
#    done


# More elegant than, but equivalent to:
#   cd source/directory
#   tar cf - . | (cd ../dest/directory; tar xpvf -)
#
#     Also having same effect:
# cp -a /source/directory/* /dest/directory
#     Or:
# cp -a /source/directory/* /source/directory/.[^.]* /dest/directory
#     If there are hidden files in /source/directory.

```


[1]:http://tldp.org/LDP/abs/html/ "Bash-Scripting Guide"
[2]:https://www.vpnso.com/main.php#pricing  "vpnso"
[3]:http://docs.huihoo.com/homepage/shredderyin/readline.html "bash readline"
[4]:http://www.ishadowsocks.com/ "free shadowsock"

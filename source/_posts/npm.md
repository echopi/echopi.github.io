title: npm 使用笔记
date: 2015-12-28
tags: npm
---


### package.json

使用以下命令初始化一个包 ,`--scope` 指定域


```
npm init --scope=xxx
```

### 常用命令


```
<!--  install & uninstall -->
npm install <pkg>@[<version>] [ -g | --save | --save-dev ]
npm uninstall <pkg>

eg.
npm install --save-dev gulp
npm install --save-dev gulp-postcss
npm install autoprefixer cssnext --save

npm uninstall gulp
npm uninstall -g gulp


<!-- symlinks -->
npm link

<!-- to find out which packages need to be updated -->
npm outdated -g --depth=0

<!-- to update all global packages -->
npm update -g

<!-- find the path to npm's directory: -->
npm config get prefix

```


### reference

- [building-a-simple-command-line-tool-with-npm][1]
- [Fixing npm permissions][3]
- [shelljs][2]


[1]:http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm "npm cmd"
[2]:https://www.npmjs.com/package/shelljs "shelljs"
[3]:https://docs.npmjs.com/getting-started/fixing-npm-permissions "permition fix"


<!-- sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share} -->


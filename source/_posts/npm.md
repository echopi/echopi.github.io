title: npm 使用笔记
---


### package.json

使用以下命令初始化一个包 ,`scope` 指定命名空间

```
npm init --scope=xxx
``

### 常用命令

```

<!--  install & uninstall -->
npm install packageName[@version] [ -g | --save | --save-dev ]
npm uninstall packageName

eg.

npm install --save-dev gulp
npm install --save-dev gulp-postcss
npm install autoprefixer cssnext --save

npm uninstall gulp

<!-- symlinks -->
npm link

```

### reference


- [building-a-simple-command-line-tool-with-npm][1]
- [shelljs][2]


[1]:http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm "npm cmd"
[2]:https://www.npmjs.com/package/shelljs "shelljs"

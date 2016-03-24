title: 移动端兼容问题记录
date: 2016-03-23 23:18:00
tags: 坑
---

过去踩过的大大小小的坑，打个标记下来，下次有人路过了就不用掉下去了。


### orientationchange

* 触发orientationchange事件回调函数时有兼容问题，具体表现在回调函数中获取window.innerWidth与window.innerHeight属性上的差异。 
* 在safari下，对orientationchange支持很好，当orientationchange触发回调时，使用window.innerWidth能或立刻获取到最新的屏幕高宽。 
* 而在Android浏览器下，需要延迟一定的时间，才能获取到正确的屏幕高宽。
* 如果触发回调函数时，立刻使用window.innerWidth，那么，只能取到方向未改变之前的高宽


建议：

在需要对旋屏作适配的场景，针对 Android 设备，可以加一个延时处理


### iOS click event don’t bubble to body

参考 jQuery 文档

On mobile iOS (iPhone, iPad and iPod Touch) the click event does not bubble to the document body for most elements and cannot be used with .live() without applying one of the following workarounds:

1. Use natively clickable elements such as a or button, as both of these do bubble todocument.
2. Use .on() or .delegate() attached to an element below the level of document.body, since mobile iOS does bubble within the body.
3. Apply the CSS style cursor:pointer to the element that needs to bubble clicks (or a parent including document.documentElement). Note however, this will disable copy\paste on the element and cause it to be highlighted when touched.


### scroll




title: How to use arguments safely in js
date: 2015-12-28
tags: arguments
---

仅使用:

- arguments.length
- arguments[i] 这里 i 必须一直是 arguments 的整数索引, 并且不能超出边界
- 除了 .length 和 [i], 永远不要直接使用 arguments (严格地说 x.apply(y, arguments) 是可以的, 但其他的都不行, 比如 .slice. Function#apply 比较特殊)
- 另外关于用到 arguments 会造成 arguments 对象的分配这一点的 FUD (恐惧), 在使用限于上面提到的安全的方式时是不必要的.

<!--more-->

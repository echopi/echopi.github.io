title: css sugar
date: 2015-12-28
tags: css
---

### [csstriggers][1]

- css attributes that matters Layout | Paint | Composite


### cubic-bezier

- http://cubic-bezier.com/#.17,.67,.83,.67


<!--more-->


```

@mixin accelerate($name) {
 will-change: $name;
 transform: translateZ(0);
 backface-visibility: hidden;
 perspective: 1000px;
}

.foo {
  @include accelerate(transform);
}

```


### reference
- [debug Keyframe][2]






[1]: http://csstriggers.com/ "csstriggers"
[2]:http://www.w3ctech.com/topic/1472 "debug Keyframe"



# Avalon CSS

- 前端开发库

```java
    /**
     * author : Alex
     * contact : zhouliang1006@126.com
     * tools: gulp,sass,browser-sync
     */
```
## 使用说明

1、npm install

2、gulp server

> 该样式库中，color 与 size 支持自定义。修改文件目录中 public / src / scss / var 下对应的文件。可生成不同配色风格的样式库。

## 书写规范

1、强制要求所有缩进为4个空格符，保持统一的代码书写风格，方便后续开发人员的继续维护工作。

2、CSS命名规范参考element-ui的BEM命名法。

3、CSS属性书写顺序：定位(position) ＝> 显示模式(display) => 宽高边距(width,height,margin,padding) ＝> 文本样式(font,color,lineHeight) ＝> 背景修饰(background,CSS3新特性)

## 记录

### gulp.js 的工程流程

1、首先通过 gulp.src() 方法获取到我们想要处理的文件流，然后把文件流通过 pipe 方法导入到 gulp 的插件中，最后把经过插件处理后的流再通过 pipe 方法导入到gulp.dest()中。

2、gulp.dest() 方法则把流中的内容写入到文件中，这里首先需要弄清楚的一点是，我们给gulp.dest()传入的路径参数，只能用来指定要生成的文件的目录，而不能指定生成文件的文件名。

3、它生成文件的文件名，使用的是导入到它的文件流自身的文件名，所以生成的文件名是由导入到它的文件流决定的，即使我们给它传入一个带有文件名的路径参数，然后它也会把这个文件名当做是目录名。

4、gulp.src() 与 gulp.watch() 都支持传入 字符串路径 或 **数组路径**，实现检测多文件。

```javascript
var gulp = require('gulp');

gulp.src('script/jquery.js')
    .pipe(gulp.dest('dist/core.js'));

// 最终生成的文件路径为 dist/core.js/jquery.js,而不是 dist/core.js;
```

5、安装gulp-babel插件报错，原因未知。 －2017.12.27

### 关于 gulp 与 grunt 的区别

grunt是以文件为媒介的工作流。gulp是使用node中的stream，首先获取到需要的stream，然后可以通过stream的pipe()方法把流导入到你想要的地方,它不需要像 grunt 频繁的生成临时文件, 这是 gulp 的编译速度比 grunt 快的一个原因。

```
流(stream)是用于在 node.js 中处理流数据的抽象接口。流模块提供了一个基础API，可以很容易地构建实现流接口的对象。
node.js提供了许多流对象。例如，对HTTP服务器和流程的请求。stdout都是流实例。
流可以可读、可写，或两者兼而有之。所有流都是event发射器的实例。
```

### gulp-ruby-sass与gulp-sass

gulp-ruby-sass 使用Sass gem编译Sass，将结果输出到一个gulp流，需要安装ruby，并且会生成临时目录和临时文件。
gulp-sass 依赖于node-sass，编译过程不需要生成临时目录和文件，直接通过buffer内容转换。

### 关于Avalon CSS的思考

1. 使用文档

2. 关于 $(selector).on(ev,func) 实现的疑问：通过遍历DOM数组，分别绑定事件时，首次触发不会出错，但多次触发事件时，会出现**绑定事件重复**现象，需要在 on 方法中加入判断，如果当前DOM已经绑定事件，则不再绑定。－2017.12.28

3. 关于 $(selector).on(ev,func) 的实现解惑，参考jQuery.on() 与 jQuery.event.add() 的源码分析，设置两个**全局** $.EVENTS = [] 和 $.guid = 0 ，当为DOM注册事件时，判断该DOM是否存在唯一属性DOM.guid，如果不存在，就赋予该DOM.guid为全局属性 $.guid 的递增值，以此确定每个DOM都是唯一的DOM，然后设置 $.EVENTS[dom.guid] 为临时事件存储对象，后续绑定事件名称都作为存储对象的属性，属性的值是事件处理函数的数组；

```javascript
    $.EVENTS = [
        {
            click: [fn1, fn2, fn3]
        },
        {
            mouseover: [fn1, fn2, fn3]
        }
        // ...
    ]

    elem.addEventlistener(type,function(ev){
        $.EVENTS[type].forEach(function(fn){
            fn.call(elem, ev)
        })
    },false)
```
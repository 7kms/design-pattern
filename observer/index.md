# 发布订阅模式

### 定义

> 发布-订阅模式又叫观察者模式,它定义对象之间的一种一对多的依赖关系,当一个对象的状态发生改变时,所有依赖于它的对象都将得到通知.在js开发中,我们一般用事件模型来替代传统的发布-订阅模式.

### 应用

##### DOM事件
```js
    document.addEventListener('click',function(e1){
        console.log(e1)
    });
    document.addEventListener('click',function(e2){
        console.log(e2)
    })
```
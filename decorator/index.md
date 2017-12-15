# 装饰着模式
### 定义
> 装饰着模式可以动态的给某个对象增加一些额外的职责,而不会影响从这个类派生出的其他对象.


### 应用


 设我们在编写一个飞机大战的游戏，随着经验的增加，我们操作的飞机对象可以升级成更厉害的飞机，一开始这些飞机只能发射普通的子弹， 到第二级时可以发射导弹， 到第三级时可以发射原子弹。

##### 模拟传统面向对象语言的装饰者模式

```js
/**
 * 传统面向对象实现装饰着模式
 */
 var Plane = function(){
     console.log('普通飞机')
 }
 Plane.prototype.fire = function(){
     console.log('发射普通子弹')
 }
 //接下来增加两个装饰类，分别是导弹和原子弹
 var MissileDecoractor = function(plane){
    console.log('======升级导弹飞机=====')
     this.plane = plane;
 }
 MissileDecoractor.prototype.fire = function(){
     this.plane.fire();
     console.log('发射导弹');
 }

 var AtomDecorator = function(plane){
    console.log('======升级原子弹飞机=====')
     this.plane = plane;
 }
 AtomDecorator.prototype.fire = function(){
    this.plane.fire();
    console.log('发射原子弹');
 }

 let test = ()=>{
     let plane = new Plane();
     plane.fire();
     plane = new MissileDecoractor(plane);
     plane.fire();
     plane = new AtomDecorator(plane);
     plane.fire();
 }

 test();
```
导弹和原子弹对象的构造函数都接受`plane`参数,在它们的`fire`方法中,除了执行自身的操作外,还会调用`plane`对象的`fire`方法.

这种给对象动态增加职责,并没有真正的改动`plane`对象本身,而是将对象放入另外一个对象当中.
这些对象以一条链的方式进行引用,当请求到达链中的某个对象时,这个对象会先执行自身的操作,然后将请求转发给下一个对象.
在这里,被装饰对象`plane`不需要了解它被谁装饰过,这种特性使得我们可以递归的嵌套任意多个装饰对象.

![image](./test1.png)


##### 装饰函数中的`this`劫持

```html
<html>
    <button id="button"></button>
    <script>
        var _getElementById = document.getElementById;
        document.getElementById = function(id){ 
            console.log('=====装饰函数=====')
            return _getElementById( id); 
        }
        var button = document.getElementById( 'button' );
    </script>
 </html>
```

![image](./test2.png)

此时_getElementById 是一个全局函数， 当调用一个全局函数时，this是指向window 的，而 document.getElementById 方法的内部实现需要使用 this引用，this在这个方法内是指向document，而不是 window, 这是错误发生的原因，所以像这种直接调用原函数的方式并不保险 。

```js
document.getElementById = function(){ 
    console.log('=====装饰函数=====')
    return _getElementById.apply(document,arguments); 
}
```
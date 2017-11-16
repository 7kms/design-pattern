# 单例模式

### 定义

> 单例模式: 保证一个类仅有一个实例,并提供一个访问它的全局访问点.

### 实现方式

1. 简单实现

```js

var Singleton = function( name ){
    this.name = name;
};
Singleton.prototype.setName = function(name){
    this.name = name;
}
Singleton.prototype.getName = function(){ 
    console.log(this.name)
};

Singleton.getInstance = (function(){ 
    var instance = null;
    return function( name ){
            if ( !instance ){
                instance = new Singleton( name );
            }else{
                instance.setName(name);
            }
            return instance; 
        }
})();

//通过 Singleton.getInstance 来获取 Singleton 类的唯一对象, 这样虽然简单,但是增加了这个类的"不透明性",Singleton的使用者必须知道这是一个单例类,并且只能用`Singleton.getInstance()`来获取对象.

var a = Singleton.getInstance( 'name1' ); 
var b = Singleton.getInstance( 'name2' );

console.log(a === b); //true

```

2. 透明的单例模式
> 实现一个"透明"的单例类,用户从这个类中创建对象的时候,可以像使用其他任何普通类一样.

```js

    var Singleton = (function(){
        var instance;
        var Singleton = function(name){
            if(instance){
                return instance;
            }
            this.name = name;
            return instance = this;
        }
        Singleton.prototype.getName = function(){
            console.log(this.name);
        }
        return Singleton;
    })();

    var a = new Singleton('aa');
    var b = new Singleton('bb');
    console.log(a === b);//true

```
此处由一个自执行函数构建了一个闭包,控制`Singleton`实例永远只有一个.但是这种做法并不良好,试想当某一天需要创建多个`Singleton`的实例,而不是单例的时候,我们不得不修改闭包中的内容.而且对于之前已经创建出来的实例,还容易产生一些未知bug.

3. 用代理实现单例模式

```js

    var Singleton = function(name){
        this.name = name;
        }
    var proxySingleton = (function(){
        var instance;
        return function(name){
            if(!instance){
                instance = new Singleton(name);
            }
            return instance;
        }
    })();
    var a = new proxySingleton('aa');
    var b = new proxySingleton('bb');
    console.log(a === b);//true

```
通过代理的方式,把控制单一实例的逻辑封装到`proxySingleton`中,把真正的业务类`Singleton`抽象出来,当需要创建多个实例的时候,可以直接使用普通类`Singleton`.



4. 通用单例的封装

我们可以进一步,把不变的继续抽象出来.试想,我们有多个业务类,这些业务类可以是单例创建,也可以普通创建.

```js

//把构建单例的方法抽象出来
 var getSingle = function(fn){
     var instance;
     return function(){
         if(!instance){
             instance = new fn(arguments);
         }
         return instance;
     }
 }

//业务类1
function Business1(){
     console.log('business1')
}

//业务类2
function Business2(){
    console.log('business2')
}

//获得一个业务类Business1的单例创建函数
var bus1 = getSingle(Business1);

//获得一个业务类Business2的单例创建函数
var bus2 = getSingle(Business2);

//调用bus1(),bus2()将返回对应类的一个实例
console.log(bus1() == bus1());//true
console.log(bus2() == bus2());//true

```



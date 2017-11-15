# 原型模式

### 概述

[《JavaScript设计模式与开发实践》：1.4　原型模式和基于原型继承的JavaScript对象系统](https://book.douban.com/reading/35008703/)

在以类为中心的面向对象编程语言中，类和对象的关系可以想象成铸模和铸件的关系，对象总是从类中创建而来。而在原型编程的思想中，类并不是必需的，对象未必需要从类中创建而来， 一个对象是通过克隆另外一个对象所得到的。

从设计模式的角度讲，原型模式是用于创建对象的一种模式，如果我们想要创建一个对象，一种方法是先指定它的类型，然后通过类来创建这个对象。原型模式选择了另外一种方式，我们不再关心对象的具体类型，而是找到一个对象，然后通过克隆来创建一个一模一样的对象。


### 定义
> 原型模式（prototype）是指用原型实例指向创建对象的种类，并且通过拷贝这些原型创建新的对象。

换句话来理解

> 以现有的对象为原型，通过clone得到新的对象（以简化新对象的创建过程）


原型模式的关键是,语言本身是否提供了克隆的方法.ECMAScript提供了[Object.create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)方法,可以用来clone对象.

```js

    var Plane = function(){
        this.blood = 100;

    // 可以在Object.create的第二个参数里使用对象字面量
    }

    var plane = new Plane();
    plane.blood = 500;传入要初始化的额外属性
    // 其语法与Object.defineProperties或Object.defineProperty方法类型
    var clonePlane = Object.create(plane);
    
    var clonePlane2 = Object.create(plane,{speed: 100});
```
 在不支持Object.create 方法的浏览器中，则可以使用以下代码 
```js
  
    Object.create = Object.create || function( obj ){ 
        var F = function(){};
        F.prototype = obj;
        return new F(); 
    }
    // 或者
    if (typeof Object.create !== "function") {
        Object.create = function (proto, propertiesObject) {
            if (!(proto === null || typeof proto === "object" || typeof proto === "function")) {
                throw TypeError('Argument must be an object, or null');
            }
            var temp = new Object();
            temp.__proto__ = proto;
            if(typeof propertiesObject ==="object")
                Object.defineProperties(temp,propertiesObject);
            return temp;
        };
    }
```

### 原型编程范型的一些规则

```js

    var Animal = new Object();
    Animal.makeSound = function(){
        console.log('animal makeSound')
    }
    var Dog = Object.create(Animal);
    Dog.eat = function(){
        console.log('dog eat')
    }
    Animal.makeSound();// animal makeSound
    Dog.eat();// dog eat


    // Dog对象并没有makeSound方法，于是把请求委托给了它的原型Animal对象 ，而 Animal 对象是有 makeSound 方法的，所以语句可以顺利得到输出
    Dog.makeSound();// animal makeSound

```

原型编程范型至少包括以下基本规则: 
1. 所有数据都是对象
2. 要得到一个对象, 不是通过实例化类, 而是要找到一个对象作为原型,并克隆它.
3. 对象会记住他的原型.
4. 如果对象无法响应某个请求, 他会把这个请求委托给它的构造器的原型

### js中的原型继承


1. 所有数据都是对象

javascript 中的根对象是Object.prototype对象.Object.prototype 对象是一个空对象。我们在 JavaScript 遇到的每个对象，都是从 Object.prototype 对象克隆而来的， Object.prototype 对象就是它们的原型
```js
    var obj1 = new Object();
    var obj2 = {};
    //可以利用 ECMAScript 5 提供的 Object.getPrototypeOf 来  这两个对象的原型 
    console.log( Object.getPrototypeOf( obj1 ) === Object.prototype ); //    true
    console.log( Object.getPrototypeOf( obj2 ) === Object.prototype ); //    true
```

2. 要得到一个对象,不是通过实例化类,而是要找到一个对象作为原型,并克隆它.

在JavaScript 语言里，我们并不需关心克隆的细节，因为这是引擎内部负责实现的。我们所需要做的只是显式地调用var obj1 = new Object()或者var obj2 = {}。此时，引擎内部会从 Object.prototype 上面克隆一个对象出来，我们最终得到的就是这个对象。


new运算符从构造器中得到一个对象


```js
    function Person(name){
        this.name = name;
    }
    Person.prototype.getName = function(){ 
        return this.name;
    }
    var aa = new Person('aa');
    console.log(aa.name);//aa
    console.log(aa.getName());//aa
    console.log(Object.getPrototypeOf(aa) === Person.prototype);//true
```

在这里 Person 并不是类，而是函数构造器，JavaScript 的函数 可以作为普通函数被调用，也可以作为构造器被调用。当使用 new运算符来调用函数时，此时的函数就是一个构造器。 用
new运算符来创建对象的过程，实际上也是先克隆Object.prototype 对象， 进行一些其他额外操作的过程

大部分浏览器向外暴露了对象的`__proto__`属性, 我们可以通过 下面的代码 来理解 `new`运算符的过程

```js

    function Person(name){
        this.name = name;
    }
    Person.prototype.getName = function(){ 
        return this.name;
    }

    var objectFactory = function(){
        var obj = new Object(); //从Object.prototype上克隆一个空的对象.
        var Constructor = [].shift.call(arguments); //从外部传入构造器,此例是Person
        console.log(Constructor);
        obj.__proto__ = Constructor.prototype; // 给obj对象设置正确的__proto__指向. 让obj.__proto__指向了Constructor.prototype 而不是原来的Object.prototype
        var ret = Constructor.apply(obj, arguments); //借用外部传入的构造器给obj设置属性
        return typeof ret == 'object' ? ret : obj;//确保构造器总是返回一个对象
    }

    var bb = objectFactory(Person,'bb');
    console.log(bb.name);//bb
    console.log(bb.getName());//bb
    console.log(Object.getPrototypeOf(bb) === Person.prototype);//true

```

3. 对象会记住它的原型.

如果请求可以在一个链条中依次往后传递, 那么每个节点都必须知道它的下一个节点.
我们一直在讨论 `"对象的原型"`, 在js的正真实现中,其实不能说对象有原型, 而只能说对象的构造器有原型.对于“对象把请求委托给它自己的原型”这句话，更好 的说法是对象把请求委托给`它的构造器原型`。

js给对象提供了一个名为`__proto__`的隐藏属性,某个对象的`__proto__`属性默认会指向它的构造器的原型,即`{Constructor}.prototype`.在大部分现代浏览器中`__proto__`被公开出来,可以在支持`__proto__`的js环境中来进行验证

```js
    var obj = new Object();
    console.log(obj.__proto__ === Object.prototype) //true
```
实际上, `__proto__`就是对象与`对象构造器的原型`联系起来的纽带.正是因为对象需要用`__proto__`来记住它的构造器原型,所以在实现`new`运算符创建对象的时候,需要手动设置`obj.__proto__`,给与正确的指向


4. 如果对象无法响应某个请求, 他会把这个请求委托给它的构造器的原型 (这条规则是原型继承的精髓所在)

js的对象最初都是由`Object.prototype`对象克隆而来,但是`对象构造器的原型`并不仅限于`Object.prototype`上,而是可以动态指向其他对象.
这样一来,当对象a需要继承对象b的时候,可以将a的构造器的原型指向对象b,以达到继承的效果

```js
    var obj = {name: 'test'};
    var A = function(){};
    A.prototype = obj;
    var a = new A();
    console.log(a.name); //test
```

```js
    var obj = {name: 'test'};
    var A = function(){};
    A.prototype = obj;

    var B = function(){};
    B.prototype = new A();
    var b = new B();

    console.log(b.name); //test
```

原型链并不是无限长的,如要访问一个不存在的属性`b.gender`时,`B.prototype`中并不存在, 此时会去`B.prototype.__proto__`即`new A().__proto__`即`obj`中寻找.而`obj`中依然没有此属性,那么会继续向上查找`obj`的构造器的原型,即`obj.__proto__`即`Object.prototype`.而`Object.prototype = {}`也不会存在此属性.则继续向上查找`Object.prototype.__proto__`,而`Object.prototype.__proto__`实际上指向的是`null`,当原型链到了`Object.prototype`的时候,再后面就已经没有节点了,该请求到此打住. 所以`b.gender`最终会返回`undefined`;

```
    graph LR
    A(b.gender)-->B(b.__proto__= B.prototype)-->C(B.prototype.__proto__ = new A().__proto__ = A.prototype)-->D(obj.__proto__ = Object.prototype)
```


### 注意点

通过设置构造器的 prototype 来实现原型继承的时候，除了根对象 `Object.prototype` 本身之外，任何对象都会有一个原型。而通过`Object.create( null )`可以创建建出没有原型的对象.

[ES6中的`Class`语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), 这让 JavaScript 看起来是一门基于类的语言， 但其背后仍是通过原型机制来创建对象。对于js中Class的原理,我们可以参考各位网友的分析 https://segmentfault.com/a/1190000008338987

### 参考链接
[《JavaScript设计模式与开发实践》：1.4　原型模式和基于原型继承的JavaScript对象系统](https://book.douban.com/reading/35008703/)
[汤姆大叔的博客(深入理解JavaScript系列（42）：设计模式之原型模式)](http://www.cnblogs.com/TomXu/archive/2012/04/16/2436460.html)
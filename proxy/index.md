# 代理模式

### 定义

> 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

代理模式使得代理对象控制具体对象的引用。代理几乎可以是任何对象：文件，资源，内存中的对象，或者是一些难以复制的东西。

代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。 替身对象对请求做出一些处理之后，再把请求交给本体对象。

```
graph LR
(客户) --> (对象)
```

```
graph LR
(客户) --> (代理) --> (对象)
```


### 保护代理
> 假设B是A的代理,那么代理B可以帮A过滤掉一些请求,一些不符合A所需条件的请求可以直接在代理B处被拒绝掉,这种代理叫做保护代理.

保护代理用于对象拥有不同访问权限的情况.


```js
    var Flower = function(){
        this.price = 9999;
    }

    var A = {
        receiveFlower(flower){
            console.log('received a flower!');
        }
    }
    var B = {
        filter(sender){
            //过滤掉不符合条件(不是boss)的送花者
            if(sender.isBoss){
                return true;
            }
            return false;
        },
        sendFlower(sender, flower){
            if(B.filter(sender)){
                A.receiveFlower(flower)
            }
        }
    }

```

### 虚拟代理
> 假设B是A的代理,C通过B给A送花,而花的代价很是昂贵.如果C直接买好了花交给B,但是C又不满足A的条件,昂贵的花就白白浪费了.所以这时候买花的这个操作完全可以交给B去执行,当C满足A送花的条件之后,B再帮A买花.

虚拟代理是最常用的代理模式.

```js
    var Flower = function(){
        this.price = 9999;
    }

    var A = {
        filter(sender){
            //过滤掉不符合条件(不是boss)的送花者
            if(sender.isBoss){
                return true;
            }
            return false;
        },
        receiveFlower(flower){
            console.log('received a flower!');
        }
    }
    var B = {
        sendFlower(sender){
            //当送花者满足A的条件,再去买花.如果不满足,就不用花钱去买花了
            if(A.filter(sender)){
                A.receiveFlower(sender.getFlower())
            }
        }
    }

```

##### 虚拟代理实现图片预加载

```js
/**
 * 虚拟代理实现图片预加载
 */
var myImage = (function(){
    var imgNode = document.createElement( 'img' ); 
    document.body.appendChild( imgNode );
    return {
        setSrc: function( src ){
            imgNode.src = src; 
        }
    } 
})();

var proxyImage = (function(){ 
    var img = new Image;
    img.onload = function(){
        myImage.setSrc(this.src); 
    }
    // 通过proxyImage间接访问MyImage.proxyImage控制了客户对MyImage的访问,并在此加入一些额外的操作
    // 比如在真正的图片加载完之前,显示一张cdn缓存的较小的loading图片
    return {
        setSrc: function( src ){
            myImage.setSrc('https://cdn.img.com/loading.png');
            img.src = src; 
        }
    } 
})();

proxyImage.setSrc('https://img.example.comg/large-picture.png');

```

### 缓存代理

缓存代理可以为一些开销大的运算结果提供暂时的存储,在下次运算时,如果传进来的参数跟之前一致,则可以直接返回前面存储的结果.

```js
var mult = function(){ 
    console.log( '开始计算乘积' ); 
    var a = 1;
    for ( var i = 0, l = arguments.length; i < l; i++ ){
        a = a* arguments[i];
    }
    return a
}
var proxyMult = (function(){
    var cache = {};
    return function(){
        var args = Array.prototype.join.call( arguments, ',' ); 
        if ( args in cache ){
            return cache[ args ]; 
        }
        return cache[ args ] = mult.apply( this, arguments ); 
    }
})();
//因为缓存,只会计算一次乘积
console.log(proxyMult( 1, 2, 3, 4 ))
console.log(proxyMult( 1, 2, 3, 4 ))
```


代理模式包括许多分类，在 JavaScript 开发中最常用的是虚拟代理和缓存代理。虽然代理模式非常有用，但我们在编写业务代码的时候，往往不需要去事先去判定是否需要使用代理模式。 当发现不方便直接访问某个对象的时候，再使用代理模式。


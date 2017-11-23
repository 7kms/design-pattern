# 迭代器模式

### 定义

> 迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素,而又不需要暴露该对象的内部表示.

##### jQuery 中的[迭代器](https://github.com/jquery/jquery/blob/master/src/core.js#L295)

```js

 function each( obj, callback ) {
    var length, i = 0;

    if ( isArrayLike( obj ) ) {
        length = obj.length;
        for ( ; i < length; i++ ) {
            if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                break;
            }
        }
    } else {
        for ( i in obj ) {
            if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                break;
            }
        }
    }

    return obj;
}

```

### 应用

1. 内部迭代器

jQuery 的each可以看做是内部迭代器, each 函数的内部已经定义好了迭代规则,它完全接手整个迭代过程,外部只需要一次初始调用

2. 外部迭代器

外部迭代器必须显示的请求迭代下一个元素,这样可以手工控制迭代的过程或者顺序.

```js

var Iterator = function(obj){
    var current = 0;
    var next = function(){
        current += 1;
    };
    var isDone = function(){
        return current >= obj.length;
    };
    var getCurrItem = function(){
        return obj[current];
    }
    return {
        next,
        isDone,
        getCurrItem
    }
}

var compare = function( iterator1, iterator2 ){
    while( !iterator1.isDone() && !iterator2.isDone() ){
        if ( iterator1.getCurrItem() !== iterator2.getCurrItem() ){ 
            throw new Error ( 'iterator1 iterator2   ' );
        } 
        iterator1.next(); 
        iterator2.next();
    }
    console.log('iterator1 和 iterator2相等'); 
}
var iterator1 = Iterator( [ 1, 2, 3 ] );
var iterator2 = Iterator( [ 1, 2, 3 ] );

compare(iterator1,iterator2);


```
3. 终止迭代器

迭代器可以像普通 for循环中的break一样，提供一种跳出循环的方法.Jquery中的each函数就是可以终止的迭代器.

```js

var each = function( ary, callback ){
    for ( var i = 0, l = ary.length; i < l; i++ ){
        if ( callback( i, ary[ i ] ) === false ){ 
            break;
        } 
    }
}

each( [ 1, 2, 3, 4, 5 ], function( i, n ){ 
    if ( n > 3 ){ return false;}
    console.log( n );
});

```

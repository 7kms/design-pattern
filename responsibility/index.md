# 职责链模式
### 定义
> 使多个对象都有机会处理请求,从而避免请求的发送者和接收者之间的耦合关系,将这些对象连城一条链,并沿着这条链传递该请求,直到有一个对象处理它为止.

### 应用

##### 处理流程代码

设想一个场景:
1. orderType表示订单类型(定金用户或者普通购买用户)，code 的 为 1 的时候是 500 元定金用户，为 2 的时候是200元定金用户，为 3 的时候是普通用户。
2. pay表示用户是否已经支付定金 ， 为 true 或者 false, 虽然用户已经下过 500元定金的订单，但如果他一直没有支付定金 ，现在只能降级进入普通购买模式。
3. stock 表示当前用于普通购买的手机库存数量，已经支付过500或者200定金的用户不受此限制。


```js
/**
 * 
 */

var order500 = function( orderType, pay, stock ){ 
    if ( orderType === 1 && pay === true ){
        console.log( '500元定金预购,得到100元优惠券'); 
    }else{
        return 'nextSuccessor'; //不知道下一个节点是谁,反正把请求往后面传递.
    } 
};

var order200 = function( orderType, pay, stock){ 
    if ( orderType === 2 && pay === true ){
        console.log( '200元定金预购,得到50元优惠券'); 
    }else{
        return 'nextSuccessor'; //不知道下一个节点是谁,反正把请求往后面传递.                      
    }
};

var orderNormal = function( orderType, pay, stock ){
    if(stock>0){
        console.log( '普通购买,无优惠券' ); 
    }else{
        console.log( '手机库存不足' ); 
    }
};

//把函数包装进职责链节点
var Chain = function(fn){
    this.fn = fn;
    this.successor = null;
}

Chain.prototype.setNextSuccessor = function(successor){
    return this.successor = successor;
}

Chain.prototype.passRequest = function(){
    var ret = this.fn.apply(this,arguments);
    if(ret == 'nextSuccessor'){
        return this.successor && this.successor.passRequest.apply(this.successor,arguments);
    }
    return ret;
}


// 把 3 个订单函数分别包装成职责链的节点 
var chainOrder500 = new Chain( order500 );
var chainOrder200 = new Chain( order200 );
var chainOrderNormal = new Chain( orderNormal );

//然后指定节点在职责链中的顺序 
chainOrder500.setNextSuccessor(chainOrder200).setNextSuccessor(chainOrderNormal);


//把请求传递给第一个节点
chainOrder500.passRequest( 1, true, 500 );//500元定金预购,得到100元优惠券
chainOrder500.passRequest( 2, true, 500 );//200元定金预购,得到50元优惠券
chainOrder500.passRequest( 3, true, 500 );//普通购买,无优惠券
chainOrder500.passRequest( 1, false, 0 );//手机库存不足


//现在可以自由灵活的添加,移除和修改链中的节点顺序,假如现在需要支持300的定金购买,只需在链中增加一个节点即可

var order300 = function( orderType, pay, stock ){ 
    if ( orderType === 3 && pay === true ){
        console.log( '300元定金预购,得到120元优惠券'); 
    }else{
        return 'nextSuccessor'; //不知道下一个节点是谁,反正把请求往后面传递.
    } 
};
var chainOrder300 = new Chain( order300 );

chainOrder500.setNextSuccessor(chainOrder300).setNextSuccessor(chainOrder200).setNextSuccessor(chainOrderNormal);

chainOrder500.passRequest( 3, true, 0 );//300元定金预购,得到120元优惠券

```

##### 异步职责链

在实际开发中,经常会有一些异步问题,比如等ajax返回之后才能决定是否继续职责链中的passRequest

```js
    //把函数包装进职责链节点
    var Chain = function(fn){
        this.fn = fn;
        this.successor = null;
    }

    Chain.prototype.setNextSuccessor = function(successor){
        return this.successor = successor;
    }

    Chain.prototype.passRequest = function(){
        var ret = this.fn.apply(this,arguments);
        if(ret == 'nextSuccessor'){
            return this.successor && this.successor.passRequest.apply(this.successor,arguments);
        }
        return ret;
    }
    /**
     * 在原型链上扩展一个next方法,供主动调用
     */
    Chain.prototype.next = function(){
        return this.successor && this.successor.passRequest.apply(this.successor,arguments);
    }

    let test = ()=>{
        let fn1 = new Chain(function(){
            console.log(1);
            return 'nextSuccessor';
        });
        let fn2 = new Chain(function(){
            console.log(2);
            setTimeout(()=>{
                this.next();
            },1000)
        });
        let fn3 = new Chain(function(){
            console.log(3);
            return 'nextSuccessor';
        });
        fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
        fn1.passRequest();
    }

    test();

```

##### 利用js的函数特性创建职责链

```js
    var order500 = function( orderType, pay, stock ){ 
    if ( orderType === 1 && pay === true ){
        console.log( '500元定金预购,得到100元优惠券'); 
    }else{
        return 'nextSuccessor'; //不知道下一个节点是谁,反正把请求往后面传递.
    }
};

var order200 = function( orderType, pay, stock){ 
    if ( orderType === 2 && pay === true ){
        console.log( '200元定金预购,得到50元优惠券'); 
    }else{
        return 'nextSuccessor'; //不知道下一个节点是谁,反正把请求往后面传递.                      
    }
};

var orderNormal = function( orderType, pay, stock ){
    if(stock>0){
        console.log( '普通购买,无优惠券' ); 
    }else{
        console.log( '手机库存不足' ); 
    }
};

Function.prototype.after = function(fn){
    var self = this;
    return function(){
        var ret = self.apply(this, arguments);
        if(ret == 'nextSuccessor'){
            return fn.apply(this, arguments);
        }
        return ret;
    }
}

var order = order500.after(order200).after(orderNormal);

order( 1, true, 500 ); 
order( 2, true, 500 ); 
order( 1, false, 500 );  
```


### 优缺点

1. 职责链中的各个职责点的处理函数互不影响.
2. 每个节点可以灵活拆分和重组.
3. 可以手动指定起始节点.
4. 不能保证请求一定会被链中的节点处理.
5. 在程序中多了一些节点对象,可能在某一次请求处理的过程中,大部分节点并没有起到实质性作用,它们的作用仅仅是让请求传递下去.职责链过长会带来性能损耗.
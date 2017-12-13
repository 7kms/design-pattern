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




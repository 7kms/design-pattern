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

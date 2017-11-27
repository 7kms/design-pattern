/**
 * 观察者模式的通用实现
 */
var event = {
    clientList: [],
    listen(key,fn){
        if(!this.clientList[key]){
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn);
    },
    triggle(){
        var key = [].shift.call(arguments);
        var fns = this.clientList[key];
        if(!fns || fns.listen == 0){
            return false;
        }
        for(let i =0; i<fns.length; i++){
            let fn = fns[i];
            fn.apply(this,arguments)
        }
    },
    remove(key,fn){
        var fns = this.clientList[key];
        if(!fns){
            return false;
        }
        if(!fn){
            //如果没有传入具体的回调函数,表示需要取消key对应消息的所有订阅
            fns ? fns.length = 0 : null;
        }else{
            this.clientList[key] = fns.filter(item=>item != fn)
        }
    }

}

var installEvent = function(obj){
    obj.__proto__ = event;
    // for(var i in event){
    //     if(Object.hasOwnProperty.call(event,i)){
    //         obj[i] = event[i];
    //     }
    // }
}

let test = ()=>{
    let salesOffices = {};
    installEvent(salesOffices);
    let fn1 = (price)=>{
        console.log('价格=' + price);
    };
    let fn2 = (price)=>{
        console.log('价格=' + price);
    };
    salesOffices.listen('squareMeter88',fn1);
    salesOffices.listen('squareMeter88',fn2);
    salesOffices.remove('squareMeter88',fn1);
    salesOffices.triggle('squareMeter88',1000);
}

test();
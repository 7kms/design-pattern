# 发布订阅模式

### 定义

> 发布-订阅模式又叫观察者模式,它定义对象之间的一种一对多的依赖关系,当一个对象的状态发生改变时,所有依赖于它的对象都将得到通知.在js开发中,我们一般用事件模型来替代传统的发布-订阅模式.


### 应用

如何实现发布-订阅模式

1. 制定好谁充当发布者
2. 给发布者添加一个缓存列表,用于存放回调函数以便通知订阅者
3. 发布者遍历缓存列表,依次触发里面存放的订阅者的回调函数

##### DOM事件
```js
    document.addEventListener('click',function(e1){
        console.log(e1)
    });
    document.addEventListener('click',function(e2){
        console.log(e2)
    })
```

##### 通用实现
```js

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

```

##### 离线订阅,独立命名空间

```js

 var Event  = (function(){
     var Event, _default = 'default';
     Event = (function(){
        var 
        _shift = [].shift,
        _unshift = [].unshift,
        namespaceCache = {},
        each = function(ary,fn){
            var ret;
            for(var i = 0, l = ary.length; i< l; i++){
                var n = ary[i];
                ret = fn.call(n,i,n);
            }
            return ret;
        },
        _listen = function(key,fn,cache){
            if(!cache[key]){
                cache[key] = [];
            }
            cache[key].push(fn);
        },
        _remove = function(key,cache,fn){
            if(cache[key]){
                if(fn){
                    cache[key] = cache[key].filter(item=>item != fn)
                }else{
                    cache[key] = [];
                }
            }
        },
        _trigger = function(){
            var cache = _shift.call(arguments),
            key = _shift.call(arguments),
            args = arguments,
            _self = this,
            stack = cache[key];
            if(!stack || !stack.length){
                return ;
            }
            return each(stack,function(){
                return this.apply(_self,args);
            })
        },
        /**
         * 根据key创建独立的命名空间
         */
        _create = function(namespace = _default){
            var cache = {},
            offlineStack = [],//离线事件
            ret = {
                listen: function(key,fn,last){
                    _listen(key,fn,cache);
                    if(offlineStack[key] === null){
                        return;
                    }
                    if(last == 'last'){
                        offlineStack[key].length && offlineStack[key].pop()();
                    }else{
                        each(offlineStack[key],function(){
                            this();
                        })
                    }
                    offlineStack[key] = null;
                },
                one: function(key,fn,last){
                    _remove(key,cache);
                    this.listen(key,fn,last);
                },
                remove: function(key,fn){
                    _remove(key,cache,fn);
                },
                trigger: function(){
                    var fn,
                        args,
                        _self = this,
                        key = arguments[0];
                    _unshift.call(arguments,cache);
                    args = arguments;
                    fn = function(){
                        return _trigger.apply( _self, args ); 
                    };
                    if(!offlineStack[key]){
                        offlineStack[key] = []
                    }
                    if ( offlineStack[key] ){
                        return offlineStack[key].push( fn );
                    }
                    return fn();
                }
            }
            return namespace ? ( namespaceCache[ namespace ] ? namespaceCache[ namespace ] :
                namespaceCache[ namespace ] = ret ): ret;
        };
        return {
            create: _create,
            one: function(key,fn,last){
                var event = this.create();
                event.one(key,fn,last);
            },
            remove: function(key,fn){
                var event = this.create();
                event.remove(key,fn);
            },
            listen: function(key,fn,last){
                var event = this.create();
                event.listen(key,fn,last);
            },
            trigger: function(){
                var event = this.create();
                event.trigger.apply(this,arguments);
            }
        }
     })();
     return Event;
 })();



 let testOffline = ()=>{
    Event.trigger('key1','value1');
    Event.trigger('key2','value2');
    let fn1 = (value)=>{
        console.log('fn1',value)
    }
    let fn2 = (value)=>{
        console.log('fn2',value)
    }
    Event.listen('key1',fn1)
    Event.listen('key2',fn2)
 }
 testOffline();

```


### 优缺点

1. 解耦
    * 时间上的解耦
    * 对象上的解耦
2. 实现异步编程,实现事件驱动.
3. 应用MVC和MVVM架构.
4. 创建订阅会消耗时间和内存,当订阅消息过后如果此消息一直没有发生,它也已经存在于内存当中.
5. 发布订阅模式虽然可以解耦对象和对象之间的关系,但是过度使用的话,对象和对象之间的必要联系也会错综复杂

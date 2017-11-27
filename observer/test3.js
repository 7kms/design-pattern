/**
 * 离线订阅,独立命名空间
 */

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
 
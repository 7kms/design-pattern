/**
 * 代理单例模式
 */


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
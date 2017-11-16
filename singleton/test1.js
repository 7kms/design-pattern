/**
 * 透明的单例模式
 */
var Singleton = (function(){
    var instance;
    var Singleton = function(name){
        if(instance){
            return instance;
        }
        this.name = name;
        return instance = this;
    }
    Singleton.prototype.getName = function(){
        console.log(this.name);
    }
    return Singleton;
})();

var a = new Singleton('aa');
var b = new Singleton('bb');
console.log(a === b); //true
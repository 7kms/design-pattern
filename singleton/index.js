/**
 * 单例模式: 保证一个类仅有一个实例,并提供一个访问它的全局访问点.
 * 
 */
let Singleton = function(name){
    this.name = name;
}
Singleton.prototype.getName = function(){
    console.log(this.name)
    return this.name;
}
Singleton.getInstance = (function(){
    let instance = null;
    return function (name){
        if(!instance){
            instance = new Singleton(name);
        }
        return instance;
    }
})();

function test (){
    let a = Singleton.getInstance('sven1');
    let b = Singleton.getInstance('sven2');
    console.log(a===b)
}
test()

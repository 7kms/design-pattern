/**
 * 通用单例的封装
 */
//把构建单例的方法抽象出来
var getSingle = function(fn){
     var instance;
     return function(){
         if(!instance){
             instance = new fn(arguments);
         }
         return instance;
     }
 }

//业务类1
function Business1(){
     console.log('business1')
}

//业务类2
function Business2(){
    console.log('business2')
}


var test = ()=>{
    //获得一个业务类Business1的单例创建函数
    var bus1 = getSingle(Business1);

    //获得一个业务类Business2的单例创建函数
    var bus2 = getSingle(Business2);

    //调用bus1(),bus2()将返回对应类的一个实例
    console.log(bus1() == bus1());//true
    console.log(bus2() == bus2());//true
}
test()
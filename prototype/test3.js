/**
 * 原型继承
 */



var obj1 = new Object();
var obj2 = {};
//可以利用 ECMAScript 5 提供的 Object.getPrototypeOf 来  这两个对象的原型 
console.log( Object.getPrototypeOf( obj1 ) === Object.prototype ); //true
console.log( Object.getPrototypeOf( obj2 ) === Object.prototype ); //true



function Person(name){
    this.name = name;
}
Person.prototype.getName = function(){ 
    return this.name;
}
var aa = new Person('aa');
console.log(aa.name);//aa
console.log(aa.getName());//aa
console.log(Object.getPrototypeOf(aa) === Person.prototype);//true


var objectFactory = function(){
    var obj = new Object(); //从Object.prototype上克隆一个空的对象.
    var Constructor = [].shift.call(arguments); //从外部传入构造器,此例是Person
    console.log(Constructor);
    obj.__proto__ = Constructor.prototype; // 指向正确的原型
    var ret = Constructor.apply(obj, arguments); //借用外部传入的构造器给obj设置属性
    return typeof ret == 'object' ? ret : obj;//确保构造器总是返回一个对象
}

var bb = objectFactory(Person,'bb');
console.log(bb.name);//bb
console.log(bb.getName());//bb
console.log(Object.getPrototypeOf(bb) === Person.prototype);//true
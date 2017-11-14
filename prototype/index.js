/**
 * http://www.cnblogs.com/TomXu/archive/2012/04/16/2436460.html
 */

/**
 * 原型模式的实现关键，是对象本身是否提供了clone方 
 */

//在不支持 Object.create 方法的浏览器中，则可以使用以下代码:
Object.create = Object.create || function( obj ){ 
    var F = function(){};
    F.prototype = obj;
    return new F(); 
}
// var plane = {
//     blood : 100, 
//     attackLevel : 1,
//     defenseLevel : 1
// }
var attack = function(){
    this.blood -= 20; 
}
var Plane = function(){ 
    this.blood = 100; 
    this.attackLevel = 1;
    this.defenseLevel = 1;
};

var plane = new Plane(); 
attack.call(plane);
plane.blood = 500; 
// plane.attackLevel = 10;
// plane.defenseLevel = 7;
// console.log(plane)
var clonePlane = Object.create(plane);
clonePlane.blood += 30
// clonePlane.__proto__.blood = 300; 
console.log( plane, clonePlane); // 输出:Object {blood: 500, attackLevel: 10, defenseLevel: 7}



// 因为不是构造函数，所以不用大写
var someCar = {
    drive: function () { },
    name: '马自达 3'
};

// 使用Object.create创建一个新车x
var anotherCar = Object.create(someCar);
console.log(someCar,anotherCar.name)
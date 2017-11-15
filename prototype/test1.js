/**
 * 原型模式的定义
 */


function Plane(){
    this.blood = 100;
}

var plane = new Plane();
plane.blood = 500;
var clonePlane = Object.create(plane);

// 可以在Object.create的第二个参数里使用对象字面量传入要初始化的额外属性，其语法与Object.defineProperties或Object.defineProperty方法类型。
// 它允许设定属性的特性，例如enumerable, writable 或 configurable。
var clonePlane2 = Object.create(plane,{speed:{value:100, enumerable: true}});

console.log(clonePlane,clonePlane2)
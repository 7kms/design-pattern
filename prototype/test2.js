/**
 * 原型编程范型的一些规则
 */

var Animal = new Object();
Animal.makeSound = function(){
    console.log('animal makeSound')
}
var Dog = Object.create(Animal)
Dog.eat = function(){
    console.log('dog eat')
}
Animal.makeSound();//animal makeSound
Dog.eat();//dog eat


// Dog对象并没有makeSound方法，于是把请求委托给了它的原型Animal对象 ，而 Animal 对象是有 makeSound 方法的，所以语句可以顺利得到输出
Dog.makeSound();// animal makeSound
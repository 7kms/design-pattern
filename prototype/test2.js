// 因为不是构造函数，所以不用大写
var someCar = {
    drive: function () { },
    name: '马自达 3'
};

// 使用Object.create创建一个新车x
var anotherCar = Object.create(someCar);
anotherCar.name = '丰田佳美';

console.log(someCar,anotherCar)
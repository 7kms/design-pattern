/**
 * 传统面向对象实现装饰着模式
 */


 var Plane = function(){
     console.log('普通飞机')
 }
 Plane.prototype.fire = function(){
     console.log('发射普通子弹')
 }
 //接下来增加两个装饰类，分别是导弹和原子弹
 var MissileDecoractor = function(plane){
    console.log('======升级导弹飞机=====')
     this.plane = plane;
 }
 MissileDecoractor.prototype.fire = function(){
     this.plane.fire();
     console.log('发射导弹');
 }

 var AtomDecorator = function(plane){
    console.log('======升级原子弹飞机=====')
     this.plane = plane;
 }
 AtomDecorator.prototype.fire = function(){
    this.plane.fire();
    console.log('发射原子弹');
 }

 let test = ()=>{
     let plane = new Plane();
     plane.fire();
     plane = new MissileDecoractor(plane);
     plane.fire();
     plane = new AtomDecorator(plane);
     plane.fire();
 }

 test();
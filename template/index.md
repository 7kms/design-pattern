# 模板方法模式
### 定义

> 模板方法模式是一种只需要使用继承就能实现的非常简单的模式

模板方法模式由两部分组成,第一部分是抽象父类,第二部分是具体的实现子类.通常在抽象父类中封装了子类的算法框架,包括实现一些公共方法以及封装子类中所有方法的执行顺序.之类通过继承这个抽象类,也继承了整个算法结构,并且可以选择重写父类的方法.

### 应用

##### 泡饮料

(1) 把水煮沸
(2) 用沸水冲泡饮料
(3) 把饮料倒进杯子
(4) 加调料

```js
/**
 * 模板方法模式  泡饮料
 * 
 */

class Beverage {
    boilWater(){
        // 把水煮沸
        console.log('boil water');
    }

    brew(){
        // 浸泡    空方法,应该由子类重写
    }
    pourInCup(){
        // 倒入杯子,   空方法,应该由子类重写
    }
    addCondiments(){
        // 添加调料,   空方法,应该由子类重写
    }


    /**
     * init 称为模板方法,该方法中封装了子类的算法框架,它作为一个算法的模板,指导子类以何种顺序去执行哪些方法.
     */
    init(){
        this.boilWater();
        this.brew();
        this.pourInCup(); 
        this.addCondiments();
    }
}



class Tea extends Beverage {
    brew(){
        console.log( '用沸水浸泡茶叶' );
    }
    pourInCup(){
        console.log( '把茶水倒进杯子' );
    }
    addCondiments(){
        console.log( '加柠檬' );
    }
}


class Coffee extends Beverage {
    brew(){
        console.log( '用沸水冲泡咖啡' );
    }
    pourInCup(){
        console.log( '把咖啡倒进杯子' );
    }
    addCondiments(){
        console.log( '加糖和牛奶' );
    }
}


let test = ()=>{
    let coffee = new Coffee();
    let tea = new Tea();
    coffee.init();
    tea.init();
}

test();
```

##### 钩子方法

```js
/**
 * 模板方法模式  钩子方法
 */

class Beverage {
    boilWater(){
        // 把水煮沸
        console.log('boil water');
    }

    brew(){
        // 浸泡    空方法,应该由子类重写
    }
    pourInCup(){
        // 倒入杯子,   空方法,应该由子类重写
    }
    addCondiments(){
        // 添加调料,   空方法,应该由子类重写
    }

    /**
     * init 称为模板方法,该方法中封装了子类的算法框架,它作为一个算法的模板,指导子类以何种顺序去执行哪些方法.
     */
    init(){
        this.boilWater();
        this.brew();
        this.pourInCup(); 

        //钩子方法的返回结果决定了模板方法后面部分的执行步骤,也就是程序接下来的走向,这样一来,程序就有了变化的可能.
        if(this.customerWantsCondiments()){
            this.addCondiments();
        }
    }
}



class CoffeeHook extends Beverage {
    brew(){
        console.log( '用沸水冲泡咖啡' );
    }
    pourInCup(){
        console.log( '把咖啡倒进杯子' );
    }
    addCondiments(){
        console.log('加糖和牛奶');
    }
    customerWantsCondiments(){
        console.log('不许要加任何调料');
       return false;
    }
}


let test = ()=>{
    let coffee = new CoffeeHook();
    coffee.init();
}

test();

```

##### 不使用继承的实现方式

```js

var Beverage  = function (params){
    var boilWater = params.boilWater || function(){
        // 把水煮沸
        console.log('boil water');
    }

    var brew = params.brew || function (){
        // 浸泡    空方法,应该由子类重写
    }

    var pourInCup = params.pourInCup || function(){
        // 倒入杯子,   空方法,应该由子类重写
    }

    var addCondiments = params.addCondiments || function(){
        // 添加调料,   空方法,应该由子类重写
    }

    var F = function(){};

    F.protoType.init = function(){
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }
    return F;
}

var Coffee = Beverage({
    brew: function(){
        console.log( '用沸水浸泡茶叶' ); 
    },
    pourInCup: function(){
        console.log( '把茶水倒进杯子' );
    },
    addCondiments: function(){
        console.log( '加柠檬' );
    }
});

var coffee = new Coffee();
coffee.init();

```

### 小结

模板方法模式是一典型的通过封装变化提高系统扩展性的设计模式。在传统的面向对象语言中，一个运用了模板方法模式的程序中，子类的方法种类和行顺序都是不变的，所以我们把这部分逻辑抽象到父类的模板方法里面。而子类的方法具体怎么实现则是可变的，于是我们将这部分变化的逻辑封装到子类中。通过增加新的子类，我们便能给系统增加新的功能，并不需要改动抽象父类以及其其他子类，这也是符合开放-封闭原则的。
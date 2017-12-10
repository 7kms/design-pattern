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
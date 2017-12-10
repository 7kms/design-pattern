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
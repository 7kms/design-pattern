# 状态模式
### 定义
> 允许一个对象在其内部状态改变时改变它的行为,对象看起来似乎修改了它的类.

状态模式的关键是区分事物的内部状态,事物内部状态的改变往往带来事物行为的改变.

### 应用

##### 电灯开关场景

有一个电灯，电灯上面有一个开关。当电灯开着的时候，此时按下开关，电灯会切换的关闭状态, 再一次按下开关，电灯又将打开。同一个开关按钮，在不同的状态下，表现出来的行为是不一样的。


先用普通方法来实现这个场景:

```js
var Light = function(){ 
    this.state = 'off'; 
    this.button = null;
};

Light.prototype.init = function(){
    var button = document.createElement( 'button' ),
    self = this;
    button.innerHTML = '开关';
    this.button = document.body.appendChild( button ); 
    this.button.onclick = function(){
        
        self.buttonWasPressed(); 
    }
};

/*
    当开关按下时,会调用buttonWasPressed,开关按下后的所有行为,都将被封装到这个方法里
*/
Light.prototype.buttonWasPressed = function(){ 
    if ( this.state === 'off' ){
        console.log( '开灯' );
        this.state = 'on';
    }else if ( this.state === 'on' ){
        console.log( '关灯' );
        this.state = 'off'; 
    }
};

var light = new Light(); 
light.init();

```
上述代码实现了一个电灯的开关状态,假设现在为电灯再添加一种状态,表现行为如下:
1. 第一次按下时打开弱光.
2. 第二次按下时打开强光.
3. 第三次按下时关闭.

```js
/*
    当开关按下时,会调用buttonWasPressed,开关按下后的所有行为,都将被封装到这个方法里
*/
Light.prototype.buttonWasPressed = function(){ 
    if ( this.state === 'off' ){
        console.log( '打开弱光' );
        this.state = 'weak';
    }else if ( this.state === 'weak' ){
        console.log( '打开强光' );
        this.state = 'strong'; 
    }else if (this.state == 'strong'){
        console.log( '关闭' );
        this.state = 'off'; 
    }
};
```
这样直接通过`if-else`来实现的缺点很明显,每次新增或者修改light的状态,都需要改动`buttonWasPressed`,状态的切换仅仅表现为对state变量的赋值.

用状态模式进行重构:
```js
//状态模式的关键是把事物的每种状态都封装成单独的类. 跟此种状态有关的行为都封装在这个类的内部

// offLightState   
var OffLightState = function( light ){
    this.light = light;
};
OffLightState.prototype.buttonWasPressed = function(){
    console.log( '弱光' );    //OffLightState 对应的行为
    this.light.setState( this.light.weakLightState );// 切换状态到 weakLightState
};


// WeakLightState   
var WeakLightState = function( light ){
   this.light = light;
};
WeakLightState.prototype.buttonWasPressed = function(){
   console.log( '强光' );    
   this.light.setState( this.light.strongLightState );
};

// StrongLightState   
var StrongLightState = function( light ){
   this.light = light;
};
StrongLightState.prototype.buttonWasPressed = function(){
   console.log( '关闭' );    //StrongLightState 对应的行为
   this.light.setState( this.light.offLightState );// 切换状态到offlineLightState
};

var Light = function(){
    this.offLightState = new OffLightState( this ); 
    this.weakLightState = new WeakLightState( this );
    this.strongLightState = new StrongLightState( this );
    this.button = null;
}

Light.prototype.init = function(){
    var button = document.createElement( 'button' ),
    self = this;
    button.innerHTML = '开关';
    this.button = document.body.appendChild( button ); 


    this.currState = this.offLightState; // 设置当前的状态    
    this.button.onclick = function(){
        self.currState.buttonWasPressed(); 
    }
};

//提供一个`Light.prototype.setState`方法,状态对象可以通过这个方法来切换light对象的状态.
Light.prototype.setState = function( newState ){
    this.currState = newState;
};    
//测试
var light = new Light(); 
light.init();
```

使用状态模式的好处很明显,它可以使每一种状态和它对应的行为之间的关系局部化,这些行为被分散和封装在各自对应的状态当中,便于阅读和管理代码.
状态之间的切换都分布在状态内部,避免了过多的`if-else`条件分支来控制状态之间的转换.

比如再将现有的状态增加一种超强光,我们的改动如下:
```js

// 首先增加一种supreStrongLight的状态
// 其次将以前strongState状态切换改成现有的SuperStrongLightState


// 增加 SuperStrongLightState   
var SuperStrongLightState = function( light ){
   this.light = light;
};
SuperStrongLightState.prototype.buttonWasPressed = function(){
   console.log( '关闭' );    //SuperStrongLightState 对应的行为
   this.light.setState( this.light.offLightState );// 切换状态到 offlineLightState
};

//改动
StrongLightState.prototype.buttonWasPressed = function(){
   console.log( '超强光' );    //StrongLightState 对应的行为
   this.light.setState( this.light.superStrongLightState );// 切换状态到 superStrongLightState
};

var Light = function(){
    this.offLightState = new OffLightState( this ); 
    this.weakLightState = new WeakLightState( this );
    this.strongLightState = new StrongLightState( this );
    this.superStrongLightState = new SuperStrongLightState( this );
    this.button = null;
}

```


##### 状态模式的通用结构

回顾一下状态模式的定义: 允许一个对象在其内部状态改变时改变它的行为,对象看起来似乎改变了它的类.

我们以逗号分隔,把这句话分成两部分来看

第一部分的意思是,将状态封装成独立的类,并将请求委托给当前的状态对象,当对象的内部状态发生改变时,会带来不同的变化.

第二部分是从客户的角度看,我们使用的对象,在不同状态下有不同的行为,这个对象看起来是从不同的类中实例化而来的,实际上这是使用了委托的效果.


我们可以对状态模式的结构进行分析,提炼出一个通用的结构模式:

1. 将各个状态封装成类
2. 把切换状态的请求委托给状态实例
3. 由状态实例来操作本体对象的状态

```js

// 1. 将各个状态封装成类
var OffLightState = function( light ){
    this.light = light;
};
OffLightState.prototype.buttonWasPressed = function(){
    console.log( '弱光' );    //OffLightState 对应的行为

    // 3. 由状态实例来操作本体对象的状态
    this.light.setState( this.light.weakLightState );// 切换状态到 weakLightState
};

var Light = function(){
    // 每个状态都是一个状态实例
    this.offLightState = new OffLightState( this ); 
    this.weakLightState = new WeakLightState( this );
    this.strongLightState = new StrongLightState( this );
    this.button = null;
}

Light.prototype.init = function(){
    var button = document.createElement( 'button' ),
    self = this;
    button.innerHTML = '开关';
    this.button = document.body.appendChild( button ); 

    this.currState = this.offLightState; // 设置当前的状态    
    this.button.onclick = function(){
        // 2. 把切换状态的请求委托给状态实例
        self.currState.buttonWasPressed(); 
    }
};

```

### 状态模式的优缺点
1. 状态模式定义了状态与行为之间的关系,并将它们封装在一个类里.通过增加新的状态类,很容易增加新的状态和转换.
2. 避免context无限膨胀,状态切换的逻辑被分布在状态中,也去掉了context中原本过多的条件分支.
3. 用对象代替字符串来记录当前状态,使得状态的切换更加自然.
4. context中是请求动作和状态类中封装的行为可以非常容易独立变化而不相互影响.
5. 状态模式的缺点就是建立了很多的状态类,增加了一定的内存消耗,并且使得状态切换的逻辑分散不能在一个地方看出整个状态机的全部逻辑.

### 状态模式的性能优化

1. 如果状态的切换不是很频繁,可以仅当state对象被需要的时候再创建,用完即刻销毁.
2. 当有多个contex对象存在的时候, 各个contex对象可以共享state对象, 也是对享元模式的应用.

### 状态模式和策略模式的区别
1. 相同点: 他们都有一个上下文,一些策略类或者状态类,上下文把请求委托给这些类来执行.
2. 不同点: 策略模式中的策略类是平行的,相互独立,基本是一些纯函数.而且是由本体对象来选择使用哪一个策略,不会改变本体对象的任何属性.
状态模式中的状态类负责本体对象的状态切换,状态类会改变本体对象的行为
/**
 * 状态模式重构电灯开关程序
 */

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
# 命令模式
### 定义
>  命令(command)指的是一个执行某些特定事情的指令。命令模式的由来，其实是回调(callback)函数的一个面向对象的替代品。

### 应用
#### 封装命令
```js
    /**
     * 请求的发送者button和被封装后的请求command是完全解耦的
     * 他们可以随时被其他同类元素所替换
     */
    var setCommand = function( button, command ){ 
        button.onclick = function(){
            command.execute();
        }
    };

    var MenuBar = {
        refresh: function(){
            console.log('创建菜单界面'); 
        }
    };

    /**
     * 这里将RefreshMenu,刷新菜单的操作封装成一个命令,RefreshMenuBarCommand可以被传递到任何地方执行
     * @param {*} receiver 
     */
    var RefreshMenuBarCommand = function( receiver ){
        return {
            execute: function(){
                receiver.refresh(); 
            }
        }
    };

    var refreshMenuBarCommand = RefreshMenuBarCommand( MenuBar );


    let button1 = document.getElementById('button1');

    setCommand(button1, refreshMenuBarCommand);

```
#### 撤销命令

```js
     /*
        模拟一个使小球运动的场景,点击按钮让小球移动到一个新位置,点击取消回到最初的位置.
    */
    var ball = document.getElementById( 'ball' );
    var pos = document.getElementById( 'pos' );
    var moveBtn = document.getElementById( 'moveBtn' );
    var cancelBtn = document.getElementById( 'cancelBtn' );
    var MoveCommand = function( receiver, pos ){ 
        this.receiver = receiver;
        this.pos = pos;
        this.oldPos = null;
    };
    MoveCommand.prototype.execute = function(){
        this.receiver.start( 'left', this.pos, 1000, 'strongEaseOut' );
        this.oldPos = this.receiver.dom.getBoundingClientRect()[ this.receiver.propertyName ];
    };
    // 小球的原始位置在小球开始移动前已经作为 command 对象的属性保存起来，所以只需要提供一个 undo 方法，并在 undo 方法中让小球回到原始位置就可以了
    // 如果用普通的方法调用来实现，也许每次都需要手工的记录小球运动的轨迹，才能让他还原到之前的位置。
    MoveCommand.prototype.undo = function(){
        this.receiver.start( 'left', this.oldPos, 1000, 'strongEaseOut' );
    };
    var moveCommand;

    moveBtn.onclick = function(){
        var animate = new Animate( ball );
        moveCommand = new MoveCommand( animate, pos.value );
        moveCommand.execute();
    };
    cancelBtn.onclick = function(){ 
        moveCommand.undo();
    };
```

#### 撤销和重做

```js
    /*
        模拟一个播放游戏录像的场景
        原理和 Canvas 画图的例子一样，我们把用户在键盘的输入都封装成命令,执行命令被存到堆栈中。播放录像的时候只需要从头开始执行这些命令即可
    */
    var Ryu = {
        attack: function(){ 
            console.log( 'attack' );
        },
        defense: function(){
            console.log( 'defense' ); 
        },
        jump: function(){ 
            console.log( 'jump' );
        },
        crouch: function(){
            console.log( 'crouch' ); 
        }
    };
    var makeCommand = function( receiver, state ){ 
        return function(){
            receiver[ state ]();
        }
    };
    var commands = {
        "119": "jump",
        "115": "crouch",
        "97": "defense", 
        "100": "attack"
    };
    var commandStack = [];
    document.onkeypress = function( ev ){
        var keyCode = ev.keyCode,
        command = makeCommand( Ryu, commands[ keyCode ] );
        if (command){
            command(); 
            commandStack.push( command );
        }
    };
    document.getElementById( 'replay' ).onclick = function(){
        var command;
        while( command = commandStack.shift() ){ 
            command();
        } 
    };
```
#### 命令队列

```js
    class MoveCommand {
        constructor(info){
            this.info = info;
        }
        /**
         * 传入回调fn,当execute方法后执行回调
         */
        execute(fn){
            setTimeout(()=>{
                console.log(`execute ${this.info}`);
                fn && fn()
            },1000)
        }
    }

    class CommandManager {
        constructor(){
            this.list = [];
            this.busy = false;
        }
        add(command){
            this.list.push(command);
        }
        exec(){
            if(this.busy) return;
            let command = this.list.shift();
            if(command){
                this.busy = true;
                command.execute(()=>{
                    this.busy = false;
                    this.exec();
                });
            }else{
                this.busy = false;
            }
        }
    }

    let cManager = new CommandManager(); 
    /**
     * 模拟短时间内产生多条命令
     * 将命令加入队列依次执行
     */
    for(let i = 0; i < 10; i++){
        let moveCommand = new MoveCommand(i);
        cManager.add(moveCommand);
        cManager.exec();
        console.log(`click times ${i}`)
    }
    
```


#### 宏命令
宏命令是一套命令的集合,通过执行宏命令的方式,可以执行一批命令

```js
    //模拟一个万能遥控器的场景
    // 只要 一个特别的按钮，它就会帮我们关上房间门，顺便打开电脑并登录QQ。

    //1. 创建好各种命令
    var closeDoorCommond = {
        execute: function(){
            console.log( 'close door' );
        }
    }
    var openPcCommond = {
        execute: function(){
            console.log( 'open computer' );
        }
    }
    var openQQCommond = {
        execute: function(){
            console.log('open qq');
        }
    }

    //定义宏命令
    //macroCommand.add 方法表示 子命令    添加进宏命令对象，当调用   宏命令对象的 execute 方法时，会迭代这一组子对象，并依次执行它们的 execute 方法
    var MacroCommand = function(){
        return {
            commandsList: [],
            add: function( command ){
                this.commandsList.push( command );
            },
            execute: function(){
                for ( var i = 0, command; command = this.commandsList[ i++ ]; ){
                    command.execute(); 
                }
            } 
        }
    };

    var macroCommand = MacroCommand();
    macroCommand.add( closeDoorCommand );
    macroCommand.add( openPcCommand );
    macroCommand.add( openQQCommand );
    macroCommand.execute();
```
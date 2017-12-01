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

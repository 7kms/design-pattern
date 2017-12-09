/**
 * command queue
 */


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
# 组合模式
### 定义
> 组合模式就是用小的子对象来构建更大的对象,而这些小的子对象本身也许由更小的"孙对象"构成.

模式最大的优点在于可以一致地对待组合对象和基本对象,客户不需要知道当前处理的是宏命令还是普通命令,只要它是一个命令,并且有`execute`方法,这个命令就可以被添加到树中.

### 应用

##### 宏命令

通过调用最上层的`execute`方法,组合对象向下传递到基本对象,最终所有基本对象都执行各自的`execute`方法.

```js
    var MacroCommand = function(){
        return {
            commandsList: [],
            add: function( command ){
                this.commandsList.push( command ); 
            },
            execute: function(){
                for ( var i = 0, command; i < this.commandsList.length; i++){
                    command = this.commandsList[i];
                    command.execute(); 
                }
            } 
        }
    };

    var openAcCommand = { 
        execute: function(){
            console.log( 'open air conditioner' ); 
        }
    };


    /**
     * the television and sound are in series, so we can use a macro command to open tv and sound
     */
    var openTvCommand = { 
        execute: function(){
            console.log( 'open tv' ); 
        }
    };
    var openSoundCommand = { 
        execute: function(){
            console.log( '    ' );
        }
    };
    var macroCommand1 = MacroCommand(); 
    macroCommand1.add( openTvCommand );
    macroCommand1.add( openSoundCommand );



    var closeDoorCommand = {
        execute: function(){
            console.log( 'close door' ); 
        }
    }

    var openPcCommand = {
        execute: function(){
            console.log( 'open pc' ); 
        }
    }


    var openQQCommand = {
        execute: function(){
            console.log( 'open qq' ); 
        }
    }

    var macroCommand2 = MacroCommand(); 
    macroCommand2.add(closeDoorCommand);
    macroCommand2.add(openPcCommand);
    macroCommand2.add(openQQCommand);


    /**
     * now combine all the commands to a super command
     */
    var macroCommand = MacroCommand();
    macroCommand.add(openAcCommand);
    macroCommand.add(macroCommand1);
    macroCommand.add(macroCommand2);


    /**
     * execute the super command
     */
    (function( command ){ 
        setTimeout(function(){
            command.execute(); 
        },1000)
    })( macroCommand );

```

##### 扫描文件夹

```js
    /**
     * 组合模式 扫描文件夹
     */

    class Folder {
        constructor(name){
            this.name = name;
            this.files = [];
        }
        add(file){
            this.files.push(file);
        }
        scan(){
            console.log('begin to scan folder: ' + this.name);
            for(let i = 0,len = this.files.length; i<len;i++){
                this.files[i].scan();
            }
        }
    }

    class File {
        constructor(name){
            this.name = name;
        }
        add(){
            throw new Error('can not add file under file');
        }
        scan(){
            console.log('scan file ' + this.name);
        }
    }

    let test = ()=>{
        var folder = new Folder( 'learning materials' ); 
        var folder1 = new Folder( 'JavaScript' ); 
        var folder2 = new Folder ( 'jQuery' );
        var file1 = new File('JavaScript design pattern and practice of development');
        var file2 = new File('proficient in Jquery');
        var file3 = new File('reconsitution and pattern');

        folder1.add(file1)
        folder2.add(file2)
    


        folder.add(folder1)
        folder.add(folder2)
        folder.add(file3)

        var folder3 = new Folder( 'Nodejs' );
        var file4 = new File( '    Node.js' ); folder3.add( file4 );
        var file5 = new File( 'JavaScript 言       ' );
        folder.add( folder3 ); 
        folder.add( file5 );

        folder.scan();
    }
    test()
```

##### 引用父对象

  对象保存了它下面的子节点的引用，这是组合模式的特点，此 时树结构是从上至下的。但有时候我们需要在子节点上保持对父节点的引用， 比如在组合模式当中使用职责链时，有可能需要让请求从子节点往父节点上冒泡传递。还有当我们删除某个文件的时候，实际上是从这个文件所在的上层文件夹中删除文件的。

```js
    /**
     * 组合模式 引用父对象
     */

    class Folder {
        constructor(name){
            this.name = name;
            this.files = [];
            this.parent = null;//增加this.parent属性

        }
        add(file){
            this.files.push(file);
            file.parent = this;//设置父对象
        }
        scan(){
            console.log('begin to scan folder: ' + this.name);
            for(let i = 0,len = this.files.length; i<len;i++){
                this.files[i].scan();
            }
        }
        remove(){
            if(!this.parent){
                return false;
            }
            this.parent.files = this.parent.files.filter(file=>file != this);
        }
    }

    class File {
        constructor(name){
            this.name = name;
        }
        add(){
            throw new Error('can not add file under file');
        }
        scan(){
            console.log('scan file ' + this.name);
        }
        remove(){
            if(!this.parent){
                return false;
            }
            this.parent.files = this.parent.files.filter(file=>file != this);
        }
    }

    let test = ()=>{
        var folder = new Folder( '学习资料' );
        var folder1 = new Folder( 'JavaScript' );
        var file1 = new Folder ( ' 深入浅出Node.js' );
        folder1.add( new File( 'JavaScript  设计模式与开发实践' ) );
        folder.add( folder1 );
        folder.add( file1 );
        // file1.remove();
        folder1.remove(); // 移除文件夹
        folder.scan();
    }

    test()
```

### 使用场景

1. 表示对象的部分-整体层次结构
2. 客户希望统一对待树中的所有对象

### 注意点

1. 组合模式不是父子关系

    组合模式是一种 HAS-A(聚合)的关系, 而不是 IS-A. 对象包含一组叶对象，但 Leaf 并不是 Composite 的子类。组合对象把请求委托给它所包含的所有叶对象，它们能合作的关键是拥有相同的接口。

2. 对叶对象操作的一致性

    组合模式除了要求组合对象和叶对象拥有想同的接口之外，还有一个必要条件， 就是对一组叶对象的操作必须具有一致性。

3. 双向映射关系

4. 用职责链模式提高组合模式的性能
 
5. 组合模式并不是完美的,通过组合模式创建了大量的对象,这些对象可能使系统负担不起.
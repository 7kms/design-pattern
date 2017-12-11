# 享元模式

### 定义

> 享元模式是一种用于性能优化的模式,享元模式的核心是运用共享技术来有效支持大量细粒度的对象.享元模式是一种以时间换空间的优化模式.

### 适用场景

1. 一个程序中使用了大量的对象,并造成了很大的内存开销.
2. 对象大多数的状态都可以变为外部状态.
3. 剥离出对象的外部状态后,可以用相对较少的共享对象取代大量对象.


### 应用

##### 文件上传
```js

/**
 * 上传文件
 * 重构前,针对每一个文件都会创建一个upload的对象
 */
(function(){
    let id = 0;
    class Upload {
        constructor(uploadType,file){
            this.uploadType = uploadType;
            this.file = file;
            this.id = id++;
        }
        init(){
            console.log(`id: ${this.id}, filename: ${this.file.fileName}, fileSize: ${this.file.fileSize}`);
        }
    }
    let startUpload = (uploadType,files)=>{
        for(let i=0;i<files.length;i++){
            let file = files[i];
            let uploadObj = new Upload(uploadType,file);
            uploadObj.init();
        }
    }
    let test = ()=>{
        startUpload('plugin',[{
            fileName:'1.txt',
            fileSize:1000
        },{
            fileName:'2.txt',
            fileSize:1100
        },{
            fileName:'3.txt',
            fileSize:1200
        }]);
    
        startUpload('flash',[{
            fileName:'1.mp4',
            fileSize:2000
        },{
            fileName:'2.mp3',
            fileSize:2100
        },{
            fileName:'3.mp3',
            fileSize:2200
        }]);
    }
    test();
})();

/**
 * 上传文件
 * 用享元模式进行重构
 */
(function(){
    let id = 0;

    //工厂进行对象实例化
    let UploadFactory = (()=>{
        let createFlyweightObjs = {};
        return {
            /**
             * uploadType 即为内部状态, 
             * 用相对较少的共享对象createFlyweightObjs[uploadType]取代大量对象.
             */
            create: function(uploadType){
                if(!createFlyweightObjs[uploadType]){
                    createFlyweightObjs[uploadType] = new Upload(uploadType);
                }
                return createFlyweightObjs[uploadType];
            }
        }
    })();


    class Upload {
        constructor(uploadType){
            this.uploadType = uploadType;
            this.id = id++;
        }
        init(file){
            console.log(`id: ${this.id}, filename: ${file.fileName}, fileSize: ${file.fileSize}`);
        }
    }

    let startUpload = (uploadType,files)=>{
        for(let i=0;i<files.length;i++){
            let file = files[i];
            let uploadObj = UploadFactory.create(uploadType);
            uploadObj.init(file);
        }
    }
    
    let test = ()=>{
        startUpload('plugin',[{
            fileName:'1.txt',
            fileSize:1000
        },{
            fileName:'2.txt',
            fileSize:1100
        },{
            fileName:'3.txt',
            fileSize:1200
        }]);
    
        startUpload('flash',[{
            fileName:'1.mp4',
            fileSize:2000
        },{
            fileName:'2.mp3',
            fileSize:2100
        },{
            fileName:'3.mp3',
            fileSize:2200
        }]);
    }
    test();
})();
```

### 内部状态和外部状态

实现享元模式的关键是把内部状态和外部状态分离开来,有多少种内部状态的组合,系统中便存在多少个共享对象,而外部状态储存在共享对象的外部,在必要时被传入共享对象来组成一个完整的对象.

考虑两种极端的情况,即没有外部状态或者没有内部状态.

##### 没有内部状态的享元
在文件上传的例子,分别进行过插件调用和Flash调用,即`startUpload('plugin',[])`和`startUpload('flash',[])`,导致程序中创建了两种不同内部状态的共享对象.
设想,如果不需要切换上传的方式,这就意味着`uploadType`是可以省略的,在继续使用享元模式的前提下,构造函数`Upload`变成了无参

```js
class Upload {
    constructor(){
        this.id = id++;
    }
    init(file){
        console.log(`id: ${this.id}, filename: ${file.fileName}, fileSize: ${file.fileSize}`);
    }
}
```

而创建享元对象的工厂需要做如下改动:

```js
//工厂进行对象实例化
let UploadFactory = (()=>{
    let uploadObj;
    return {
        create: function(){
            if(!uploadObj){
                uploadObj = new Upload(uploadType);
            }
            return uploadObj;
        }
    }
})();

```
当对象没有内部状态的时候,生成共享对象的工厂实际上变成了一个单例工厂,虽然这时候共享对象没有内部状态的区分,但还是有剥离外部状态的过程,我们依然倾向于称之为享元模式.

##### 没有外部状态的享元

```java

// Java  
public class Test {
    public static void main( String args[] ){ 
        String a1 = new String( "a" ).intern();
        String a2 = new String( "a" ).intern();
        System.out.println( a1 == a2 ); // true
    } 
}

```
在这  Java 代码里，分别 new 了两个字符串对象 a1 和 a2。intern 是一 对象池技术， `new String("a").intern()`的含义如下。
1. 如果值为a的字符串对象已经存在于对象池中，则返回这个对象的引用。
2. 如果不在对象池中,则将字符串a的对象添加进对象池,并返回这个对象的引用.

所以a1==a2的结果是true,但这并不是使用了享元模式的结果.享元模式的过程是剥离外部状态,并把外部状态保存在其他地方, 在合适的时候再把外部状态组装进共享对象.这里并没有剥离外部状态的过程,a1和a2完全指向的是同一个对象.所以如果没有外部状态的剥离,即使这里使用了共享的技术,但也不是一个享元模式.


### 对象池
对象池维护一个装载空闲的池子,如果需要对象的时候,不是直接new,而是在对象池中去获取.如果对象池中没有空闲的对象,则创建一个新对象,当获取出的对象完成它的职责后,再进入池子等待下一次获取.

```js
    /**
     * 通用对象池的实现
     */

    var objectPoolFactory = function( createObjFn ){
        var objectPool = [];
        return {
            create: function(){
                var obj = objectPool.length === 0 ?
                createObjFn.apply( this, arguments ) : objectPool.shift();
                return obj; 
            },
            recover: function( obj ){
                objectPool.push( obj );
            }
        }
    }

    var iframeFactory = objectPoolFactory( function(){
        var iframe = document.createElement( 'iframe' );
        document.body.appendChild( iframe );
        iframe.onload = function(){
            iframe.onload = null; //  防止iframe重复加载的bug
            iframeFactory.recover( iframe );// iframe加载完成之后回收节点.
        }
        iframeFactory.recover( iframe );
        return iframe;
    });
    
    var iframe1 = iframeFactory.create(); 
    iframe1.src = 'http:// baidu.com';
    var iframe2 = iframeFactory.create(); 
    iframe2.src = 'http:// QQ.com';
    setTimeout(function(){
        var iframe3 = iframeFactory.create();
        iframe3.src = 'http:// 163.com'; 
    }, 3000 );

```

对象池是另外一种性能优化方案，它跟享元模式有一些相似之处，但没有分离内部状态和外部状态这个过程。




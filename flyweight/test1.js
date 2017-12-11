
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
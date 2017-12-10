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
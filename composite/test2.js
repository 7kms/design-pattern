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
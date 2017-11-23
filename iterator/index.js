/**
 * Iterator 迭代模式
 * 外部迭代器
 */


var Iterator = function(obj){
    var current = 0;
    var next = function(){
        current += 1;
    };
    var isDone = function(){
        return current >= obj.length;
    };
    var getCurrItem = function(){
        return obj[current];
    }
    return {
        next,
        isDone,
        getCurrItem
    }
}



var compare = function( iterator1, iterator2 ){
    while( !iterator1.isDone() && !iterator2.isDone() ){
        if ( iterator1.getCurrItem() !== iterator2.getCurrItem() ){ 
            throw new Error ( 'iterator1 iterator2   ' );
        } 
        iterator1.next(); 
        iterator2.next();
    }
    console.log('iterator1 和 iterator2相等'); 
}
var iterator1 = Iterator( [ 1, 2, 3 ] );
var iterator2 = Iterator( [ 1, 2, 3 ] );

compare(iterator1,iterator2);
/**
 * 虚拟代理实现图片预加载
 */
var myImage = (function(){
    var imgNode = document.createElement( 'img' ); 
    document.body.appendChild( imgNode );
    return {
        setSrc: function( src ){
            imgNode.src = src; 
        }
    } 
})();

var proxyImage = (function(){ 
    var img = new Image;
    img.onload = function(){
        myImage.setSrc(this.src); 
    }
    // 通过proxyImage间接访问MyImage.proxyImage控制了客户对MyImage的访问,并在此加入一些额外的操作
    // 比如在真正的图片加载完之前,显示一张cdn缓存的较小的loading图片
    return {
        setSrc: function( src ){
            myImage.setSrc('https://cdn.img.com/loading.png');
            img.src = src; 
        }
    } 
})();

proxyImage.setSrc('https://img.example.comg/large-picture.png');

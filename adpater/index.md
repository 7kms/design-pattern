# 适配器模式
> 适配器模式的作用是解决两个软件实体间的接口不兼容问题,使用适配器模式后,原本由于接口不兼容而不能工作的两个软件实体可以一起工作.


### 应用实例

1. google和baidu地图的切换

```js

var googleMap = {
    show:function(){
        console.log('show google map');
    }
};

var baiduMap = {
    show:function(){
        console.log('show baidu map');
    }
};

var renderMap = function(map){
    map.show && map.show();
};

renderMap(googleMap);// show google map
renderMap(baiduMap);// show baidu map

```
这段程序能够顺利运行的关键是`googleMap`和`baiduMap`提供了一致的`show`方法,设想如果`baiduMap`提供的显示地图的方法不叫`show`而是叫`display`,我们不能直接去修改`baiduMap`的源码,这时候我们可以对`baiduMap`增加一个适配器`baiduMapAdapter`. 

```js
var baiduMapAdapter = {
    show: funtion(){
        return baiduMap.display();
    }
};

renderMap(baiduMapAdapter);
```


2. 设想我们正在编写一个渲染广东省地图的页面,目前从第三方资源里获得了广东省的城市数据,并且以及成功渲染到了页面当中.
```js

var getGuangdongCity = function(){ 
    var guangdongCity = [
        {name: 'shenzhen', id: 11}, 
        {name: 'guangzhou', id: 12} 
        ];
    return guangdongCity; 
};
var render = function( fn ){
    console.log( '开始渲染广东省地图' ); 
    document.write( JSON.stringify( fn() ) );
};
render( getGuangdongCity );
```

利用这些数据,我们的系统稳定运行了一段时间,但是后来发现数据不全,缺少了很多城市.我们找到了一份全面的数据,但是数据格式和之前的不同

```js

var guangdongCity = { 
    shenzhen: 11,
    guangzhou: 12, 
    zhuhai: 13
};

```
为了不影响之前系统的稳定性,我们不会去改动原来的代码,最好的办法是新增一个数据格式转换的适配器:

```js
var getGuangdongCity = function(){ 
    var guangdongCity = [
        {name: 'shenzhen', id: 11}, 
        {name: 'guangzhou', id: 12} 
        ];
    return guangdongCity; 
};

var render = function( fn ){
    console.log( '开始渲染广东省地图' ); 
    document.write( JSON.stringify( fn() ) );
};




//新的数据格式
var getGuangdongCity2 = function(){ 
     var guangdongCity = { 
            shenzhen: 11,
            guangzhou: 12, 
            zhuhai: 13
    };
    return guangdongCity; 
};


// 将新的数据格式转化成老数据格式,不会破坏系统的稳定性
var addressAdapter = function(newAddressfn){
    var address = [],
        newAddress = newAddressfn();
        for(var i in newAddress){
            if(newAddress.hasownProperty(i)){
                address.push({
                    name: i,
                    id: newAddress[i]
                })
            }
        }
    return function(){
        return address
    }
};

render( addressAdapter( getGuangdongCity2 ) );

```




### 小结
有一些模式跟适配器模式的结构非常相似,比如装饰者模式,代理模式和外观模式.这几种模式都属于"包装模式",都是由一个对象来包装另一个对象.区别它们的关键仍然是模式的意图.

1. 适配器模式主要用来解决两个已有结构之间不匹配的问题,它不考虑这些接口是怎样实现的,也不考虑他们将来可能会如何演化,适配器模式不需要改变已有的接口,就能够使他们协同作用.
2. 装饰者模式和代理模式也不会改变原有对象的接口,但装饰者模式的作用是为了给对象增加功能.装饰者模式常常形成一条长的装饰链,而适配器模式通常只包装一次.代理模式是为了控制对对象的访问,通常也只包装一次.
3. 外观模式的作用倒是和适配器比较相似,有人把外观模式看成是一组对象的适配器,但外观模式最显著的特点是定义了一个新的接口.
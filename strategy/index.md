# 策略模式

### 定义
> 策略模式: 定义一些列的算法,把它们一个个封装起来,并且使他们可以相互替换.

### 应用

##### 使用策略模式计算奖金

很多公司的年终奖是根据员工的工资基数和绩效来发的。例如，绩效为S的人年终有4倍工资， 绩效为A的人年终有3倍工资 ，而绩效为B的人年终是2倍工资。

1.  最初实现

```js

    var calculateBonus = function( performanceLevel, salary ){
        if ( performanceLevel === 'S' ){ 
            return salary * 4;
        }
        if ( performanceLevel === 'A' ){ 
            return salary * 3;
        }
        if ( performanceLevel === 'B' ){ 
            return salary * 2;
        } 
    };
    calculateBonus( 'B', 20000 ); //    40000 
    calculateBonus( 'S', 6000 ); //    24000
```
这段代码的缺点十分明显,当`performanceLevel`的种类越多的时候,`if`语句就越多.而且奖金系数也缺乏灵活性.

2. 使用策略模式重构代码

再看看策略模式的概念: 定义一些列的算法,把它们一个个封装起来,并且使他们可以相互替换.

```js
var strategies = {
    "S": function( salary ){
        return salary * 4; 
    },
    "A": function( salary ){ 
        return salary * 3;
    },
    "B": function( salary ){
        return salary * 2; 
    }
};
var calculateBonus = function( level, salary ){ 
    return strategies[level](salary);
};

console.log( calculateBonus( 'S', 20000 ) ); //    80000
console.log( calculateBonus( 'A', 10000 ) ); //    30000

```

##### 多态在策略模式中的体现
通过使用策略模式重构代码，我们消除了原程序中大量的条件分支语句。所有计算奖金的逻辑都不在 Context 中，而是分布在各个策略对象中。Context 并没有计奖金的能力，而是把这个策略委托给了某个策略对象。每个对象负责的算法已经各自封装在对象内部。当我们对这些策略对象发出“计算奖金”的请求时，它们会返回各自不同的计算结果，这正是对象多态性的体现，也是“它们可以相互替换”的目的。 替换Context 中当前保存的策略对象， 便能执行不同的算法来得到我们想要的结果。


### 策略模式的优缺点

##### 优点
1. 模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句.
2. 策略模式提供了对开发-封闭原则的完美支持,将算法封装在独立的strategy中,使他们易于切换,易于理解,易于扩展.
3. 策略模式中的算法也可以复用到系统的其他地方,避免许多重复的复制粘贴工作.
4. 策略模式中利用组合和委托来让Context拥有执行算法的能力,这也是继承的一种更轻便的代替方案.

##### 缺点
1. 使用策略模式会使得程序当中有很多策略对象或者类,但事实上把策略对象或者类单独抽象出来会比直接写到context中要好
2. 使用策略模式必须要了解各个strategy之间的不同点,这样才能选择一个合适的strategy.

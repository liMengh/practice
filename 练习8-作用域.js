// var x = 1,
//     y = 2;
// var z = function () {
//     var x = 2;
//     return {
//         x,
//         y (a,b){
//             x = a + b;
//         },
//         z(){
//             return x;
//         }
//     }
// };
// // var a = z();
// // a.y(x,y);
// // console.log(a.z(), a.x, x);
//
// console.log(a);
// var a = 10;
// console.log(a);
//
// // 输出结果：
// // undefined
// // 10
//
// for (var i = 0; i < 3; i++) {
//     setTimeout(() => console.log(i), 0);
// }
// // 输出：3 3 3
//
// for (let j = 0; j < 3; j++) {
//     setTimeout(() => console.log(j), 0);
// }
// // 输出：0 1 2
// function createCounter() {
//     let count = 0;
//     return function() {
//         return ++count;
//     };
// }
// const counter = createCounter();
// // console.log(counter()); // 1
// // console.log(counter()); // 2
//
// var a = 1;
// function outer() {
//     var a = 10;
//     function inner() {
//         console.log(a);
//     }
//     return inner;
// }
// var innerFunc = outer();
// innerFunc();
// 输出：2

// var c = 1;
// function foo(c) {
//     console.log("foo",c);
//     var c = 2;
//     console.log("foo",c);
//     function c() {}
//     console.log("foo-c",c);
// }
// foo(3);
// 输出：
// ƒ c() {}
// 2
// 2
// 模块模式
const MyModule = (function() {
    // 私有变量（外部无法访问）
    let privateVar = "I'm private";

    // 私有方法（外部无法访问）
    function privateMethod() {
        console.log(privateVar);
    }

    // 返回公共 API（外部可访问）
    return {
        publicMethod: function() {
            privateMethod(); // 内部可调用私有方法
        },
        publicVar: "I'm public"
    };
})();
MyModule.publicMethod();
console.log(MyModule.publicVar)
const SingletonModule = (function() {
    let instance;

    function init() {
        // 私有变量
        let value = 0;

        // 公共 API
        return {
            getValue: function() { return value; },
            setValue: function(v) { value = v; }
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();
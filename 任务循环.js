console.log('1. 开始'); // 同步代码，立即执行

setTimeout(() => {
    console.log('6. setTimeout 回调'); // 宏任务
}, 0);

Promise.resolve().then(() => {
    console.log('4. Promise 回调 1'); // 微任务
}).then(() => {
    console.log('5. Promise 回调 2'); // 微任务
});

console.log('2. 中间'); // 同步代码，立即执行

new Promise(resolve => {
    console.log('3. Promise 构造函数'); // 同步代码
    resolve();
}).then(() => {
    console.log('7. 另一个 Promise 回调'); // 微任务
});

console.log('8. 结束'); // 同步代码，立即执行

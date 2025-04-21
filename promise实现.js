class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.onFulfilledCallbacks = [];

        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilledCallbacks.forEach(fn => fn());
            }
        };

        executor(resolve);
    }

    then(onFulfilled) {
        return new MyPromise((resolve) => {
            const wrappedFn = () => {
                const result = onFulfilled(this.value);
                resolve(result);
            };
            if (this.state === 'fulfilled') {
                wrappedFn();
            } else {
                this.onFulfilledCallbacks.push(wrappedFn);
            }
        });
    }
}

// 使用示例
new MyPromise(res => res(10))
    .then(v => v * 2)
    .then(console.log); // 20

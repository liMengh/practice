const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        this.state = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.state === PENDING) {
                //执行微任务
                queueMicrotask(() => {
                    this.state = FULFILLED;
                    this.value = value;
                    this.onFulfilledCallbacks.forEach(fn => fn(value));
                });
            }
        };

        const reject = (reason) => {
            if (this.state === PENDING) {
                queueMicrotask(() => {
                    this.state = REJECTED;
                    this.reason = reason;
                    this.onRejectedCallbacks.forEach(fn => fn(reason));
                });
            }
        };

        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    then(onFulfilled, onRejected) {
        // 支持值穿透
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err; };

        return new MyPromise((resolve, reject) => {
            const process = (callback, value, resolve, reject) => {
                try {
                    const result = callback(value);
                    if (result instanceof MyPromise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch (err) {
                    reject(err);
                }
            };

            if (this.state === FULFILLED) {
                queueMicrotask(() => process(onFulfilled, this.value, resolve, reject));
            } else if (this.state === REJECTED) {
                queueMicrotask(() => process(onRejected, this.reason, resolve, reject));
            } else {
                this.onFulfilledCallbacks.push((val) => {
                    process(onFulfilled, val, resolve, reject);
                });
                this.onRejectedCallbacks.push((reason) => {
                    process(onRejected, reason, resolve, reject);
                });
            }
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(callback) {
        return this.then(
            val => MyPromise.resolve(callback()).then(() => val),
            err => MyPromise.resolve(callback()).then(() => { throw err; })
        );
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value));
    }

    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }
}

const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('Hello World');
    }, 1000);
});

promise
    .then(res => {
        console.log('Result:', res);
        return res + '!';
    })
    .then(res => {
        console.log('Chained:', res);
        throw new Error('Something went wrong');
    })
    .catch(err => {
        console.error('Caught:', err.message);
    })
    .finally(() => {
        console.log('All done');
    });


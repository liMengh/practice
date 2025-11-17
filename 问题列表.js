// const shape = {
//     radius: 10,
//     diameter() {
//         return this.radius * 2;
//     },
//     perimeter: () => {
//         console.log(this)
//         return 2 * Math.PI * this.radius
//     },
// };
//
// console.log(shape.diameter());
// console.log(shape.perimeter());
// console.log(this)
//
// const a = {};
// const b = { key: 'b' };
// const c = { key: 'c' };
//
// const person = { name: 'Lydia' };
//
// function sayHi(age) {
//     return `${this.name} is ${age}`;
// }
//
// console.log(sayHi.call(person, 21));
// console.log(sayHi.apply(person,[21]));
//
// console.log((() => 0)())
//
// const numbers = [1, 2, 3];
// numbers[10] = 11;
// console.log([...'Lydia']);
//
// let birthYear = '1997';
// function getInfo(member, year) {
//     member.name = 'Lydia';
//     year = '1998';
// }
//
// const person2 = { name: 'Sarah' };
//
//
// getInfo(person2, birthYear);
//
// console.log(person2, birthYear);
//
// function Car() {
//     this.make = 'Lamborghini';
//     return { make: 'Maserati' };
// }
//
// const myCar = new Car();
// console.log(myCar.make);
//
// (() => {
//     let x = (y = 10);
// })();
//
// console.log(typeof x);
// console.log(typeof y);
//
// const set = new Set([{1:1}, 2, 3, 4]);
//
// console.log(set);

// const numbers = [1, 2, 3, 4, 5];
// const [y] = numbers;
//
// console.log(y);
// console.log("******************************************")
// let num = 10;
//
// const increaseNumber = () => num++;
// const increasePassedNumber = number => number++;
//
// const num1 = increaseNumber();
// const num2 = increasePassedNumber(num1);
//
// console.log(num1);
// console.log(num2);
//
// const value = { number: 10 };
//
// const multiply = (x = { ...value }) => {
//     console.log((x.number *= 2));
// };
//
// multiply();
// multiply();
// multiply(value);
// multiply(value);
// multiply(value);
// console.log("******************************************")
// const sumWithInitial =  [1, 2, 3, 4].reduce((x, y) => {
//     return x + y
// },0);
// console.log(sumWithInitial)
// const name = 'Lydia Hallie';
// console.log(name.padStart(13));
// console.log(name.padStart(2));
// console.log('🥑' + '💻');
//
// const add = () => {
//     const cache = {};
//     return num => {
//         if (num in cache) {
//             return `From cache! ${cache[num]}`;
//         } else {
//             const result = num + 10;
//             cache[num] = result;
//             return `Calculated! ${result}`;
//         }
//     };
// };
//
// const addFunction = add();
// console.log(addFunction(10));
// console.log(addFunction(10));
// console.log(addFunction(5 * 2));
//
// const myLifeSummedUp = ['☕', '💻', '🍷', '🍫'];
//
// for (let item in myLifeSummedUp) {
//     console.log(item);
// }
//
// for (let item of myLifeSummedUp) {
//     console.log(item);
// }
//
// const person = {
//     name: 'Lydia',
//     age: 21,
// };
//
// let city = person.city;
// city = 'Amsterdam';
//
// console.log(this['person.city']);
// function sum(num1, num2 = num1) {
//     console.log(num1 + num2);
// }
//
// sum(10);

// const person = {
//     name: 'Lydia',
//     age: 21,
// };
//
// for (const [x, y] of Object.entries(person)) {
//     console.log(x, y);
// }
// function getItems(fruitList, ...args, favoriteFruit) {
//     return [...fruitList, ...args, favoriteFruit]
// }
//
// getItems(["banana", "apple"], "pear", "orange")

// function nums(a, b) {
//     if (a > b) console.log('a is bigger');
//     else console.log('b is bigger');
//     return a + b;
// }
//
// console.log(nums(4, 2));
// console.log(nums(1, 2));
//
// class Person {
//     constructor() {
//         this.name = 'Lydia';
//     }
// }
//
// Person = class AnotherPerson {
//     constructor() {
//         this.name = 'Sarah';
//     }
// };
//
// const member = new Person();
// console.log(member.name);
//
// const info = {
//     [Symbol('a')]: 'b',
// };
//
// console.log(info);
// console.log(Object.keys(info));

// const getList = ([x, ...y]) => [x, y]
// const getUser = user => ({ name: user.name, age: user.age })
//
// const list = [1, 2, 3, 4]
// const user = { name: "Lydia", age: 21 }
//
// console.log(getList(list))
// console.log(getUser(user))
//
// const output = `${[] || 'Im'}possible!
// You should${'' || `n't`} see a therapist after so much JavaScript lol`;
// console.log(output)

// const myPromise = () => Promise.resolve('I have resolved!');
//
// function firstFunction() {
//     myPromise().then(res => console.log(res));
//     console.log('second');
// }
//
// async function secondFunction() {
//     console.log(await myPromise());
//     console.log('second');
// }
//
// firstFunction();
// secondFunction();

// console.log(Promise.resolve(5))
const factorial = () => {
  for (let i = 1; i < 10; i++){

    for (let j = 1; j <= i; j++){
      console.log( `${j} * ${i} = ${j * i}`)
    }
  }
}
// factorial();
class Scheduler {
  jobArray = [];
  runJobsArray = [];
  freshing = false;
  isFrshing = false;
  seenJobArray = [];

  constructor() {}

  runJobs() {
    if (this.runJobsArray.length < 2) {
      const currentJob = this.jobArray.shift();
      if (currentJob != null) {
        this.runJobsArray.push(currentJob);
      } else if (currentJob == null) {
        const j = this.runJobsArray[0];
        const senndJobObj = this.seenJobArray.find((s) => s.j === j);

        if (senndJobObj) {
          senndJobObj.promise.then((res) => {
            j.resolve(res);
          });
        }
      }
    }

    if (this.runJobsArray.length === 2 && !this.isFrshing) {
      this.isFrshing = true;

      Promise.race(
          this.runJobsArray.map((j) => {
            const senndJobObj = this.seenJobArray.find((s) => s.j === j);

            if (senndJobObj) {
              return senndJobObj.promise.then((res) => {
                return {
                  res,
                  resolve: j.resolve,
                };
              });
            }

            const promise = j.task();

            if (senndJobObj == null) {
              this.seenJobArray.push({ j, promise });
            }

            return promise.then((res) => {
              return {
                res,
                resolve: j.resolve,
              };
            });
          })
      ).then((res) => {
        res.resolve(res);
        this.isFrshing = false;
        this.runJobsArray = this.runJobsArray.filter(
            (r) => r.resolve !== res.resolve
        );

        this.runJobs();
      });
    }
  }

  add(task) {
    let resolveValue;
    const promise = new Promise((resolve) => {
      resolveValue = resolve;
    });

    this.jobArray.push({ task, resolve: resolveValue });
    this.runJobs();

    return promise;
  }
}

/* 测试代码，请勿修改 */
const timeout = (time) =>
    new Promise((resolve) => {
      // console.log('执行了', time);
      setTimeout(resolve, time);
    });

const scheduler = new Scheduler();
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');

// 输出
// output: 2 3 1 4
// 一开始，1、2两个任务进入队列
// 500ms时，2完成，输出2，任务3进队
// 800ms时，3完成，输出3，任务4进队
// 1000ms时，1完成，输出1
// 1200ms时，4完成，输出4











































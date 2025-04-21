// Object.prototype[Symbol.iterator] = function (){
//     const arr = Object.values(this);
//     return arr[Symbol.iterator]();
// }

// var [a,b] = {
//     a: 3,
//     b: 4
// };
// console.log(a,b);

function makeIterable(obj) {
    return new Proxy(obj, {
        get(target, prop) {
            // console.log("prop",prop)
            // console.log("target",target)
            if (prop === Symbol.iterator) {
                return function* () {
                    yield* Object.values(target);
                };
            }
            return target[prop];
        }
    });
}

const obj = { a: 1, b: 2 };
const iterableObj = makeIterable(obj);
var [a,b] = iterableObj;
// console.log(a,b);
// for (const val of iterableObj) {
//     console.log(val); // 1, 2
// }

var a = {
    b: 42,
    c: "42",
    d: [1,2,3]
};
console.log(JSON.stringify( a, ["b","c"] ))
JSON.stringify( a, ["b","c"] ); // "{"b":42,"c":"42"}"
JSON.stringify( a, function(k,v){
    if (k !== "c") return v;
} );
console.log(JSON.stringify( a, function(k,v){
    if (k !== "c") return v;
} ))

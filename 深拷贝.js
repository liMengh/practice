function deepClone(obj, hash = new WeakMap()) {
    // 基础类型直接返回
    if (obj === null || typeof obj !== "object") return obj;

    // 如果已拷贝过，直接返回存储的副本
    if (hash.has(obj)) return hash.get(obj);

    // 处理特殊对象
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);

    // 判断是数组还是对象
    const result = Array.isArray(obj) ? [] : {};

    // 缓存副本，避免循环引用
    hash.set(obj, result);

    // 递归拷贝属性
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = deepClone(obj[key], hash);
        }
    }

    return result;
}

const a = { name: "Alice" };
a.self = a;  // 循环引用

const b = deepClone(a);

console.log(b);         // { name: "Alice", self: [Circular] }
console.log(b.self === b); // true
console.log(b === a);      // false

function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    console.log("args",args)
    const key = JSON.stringify(args); // 将参数转化为唯一的缓存键
    if (cache.has(key)) {
      return cache.get(key); // 如果缓存中存在该结果，直接返回
    }
    const result = fn(...args);
    cache.set(key, result); // 将计算结果存入缓存
    return result;
  };
}

// 示例：计算两个数的乘积
function multiply(a, b) {
  console.log('Performing calculation...');
  return a * b;
}

const memoizedMultiply = memoize(multiply);

console.log(memoizedMultiply(2, 3)); // Performing calculation... => 6
console.log(memoizedMultiply(3, 2)); // => 6 (from cache)
console.log(memoizedMultiply(3, 4)); // Performing calculation... => 12

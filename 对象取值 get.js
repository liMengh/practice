function get(obj , path, defaultValue) {
    if (!obj || typeof obj !== 'object') return defaultValue;

    const keys = Array.isArray(path) ? path : path.replace(/\[(\d+)\]/g, ".$1").split(".");

    let result = obj;
    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key];
        } else {
            return defaultValue;
        }
    }

    return result;
}

// 示例
const data = { a: { b: { c: 1 } } };
console.log(get(data, "a.b.c    "));
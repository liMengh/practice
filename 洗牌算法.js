function fisherYatesShuffle(array) {
  // 从数组的最后一个元素开始
  for (let i = array.length - 1; i > 0; i--) {
    // 随机选择一个索引 j（0 <= j <= i）
    const j = Math.floor(Math.random() * (i + 1));

    // 交换元素
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 示例：
const arr = [1, 2, 3, 4, 5];
console.log("Original Array:", arr);
console.log("Shuffled Array:", fisherYatesShuffle(arr));

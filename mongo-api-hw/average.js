function average(numbers) {
  if (numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  return sum / numbers.length;
}

console.log(average([1, 2, 3, 4, 5]));
console.log(average([10, 20, 30]));
console.log(average([]));

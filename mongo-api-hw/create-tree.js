function createTree(depth) {
  if (depth <= 0) {
    return null;
  }
  return {
    value: depth,
    child: depth === 1 ? null : createTree(depth - 1),
  };
}

console.log(JSON.stringify(createTree(3)));
console.log(JSON.stringify(createTree(1)));
console.log(JSON.stringify(createTree(5)));

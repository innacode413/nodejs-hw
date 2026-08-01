function productDescription({ name, price, inStock }) {
  const stock = inStock ? 'Так' : 'Ні';
  return `Товар: ${name}, Ціна: ${price} грн., В наявності: ${stock}`;
}

console.log(productDescription({ name: 'iPhone 15', price: 1200, inStock: true }));
console.log(productDescription({ name: 'Книга', price: 350, inStock: false }));

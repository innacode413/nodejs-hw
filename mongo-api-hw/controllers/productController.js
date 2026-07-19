const Product = require('../models/productModel');

async function getAll(req, res) {
  const products = await Product.find();
  res.json(products);
}

async function getOne(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
}

async function create(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}

async function update(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
}

async function remove(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ message: 'Product deleted' });
}

module.exports = { getAll, getOne, create, update, remove };

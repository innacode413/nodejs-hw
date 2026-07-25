const Product = require('../models/productModel');

let cache = null;
let cacheTime = 0;
const CACHE_TTL = 30 * 1000;

async function getAll(req, res, next) {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) {
    console.log('[cache] Повернення з кешу');
    return res.json(cache);
  }
  try {
    const products = await Product.find();
    cache = products;
    cacheTime = now;
    console.log('[db] Завантаження з MongoDB');
    res.json(products);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const product = await Product.create(req.body);
    cache = null;
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    cache = null;
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    cache = null;
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };

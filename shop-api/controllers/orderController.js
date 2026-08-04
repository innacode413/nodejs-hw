const Order = require('../models/Order');
const Product = require('../models/Product');

async function createOrder(req, res, next) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Замовлення має містити хоча б один товар' });
    }

    const orderItems = [];
    let total = 0;

    for (const { productId, quantity } of items) {
      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ error: 'Кожен елемент має містити productId та quantity >= 1' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: `Товар не знайдено: ${productId}` });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ error: `Недостатньо товару "${product.title}" на складі` });
      }

      orderItems.push({
        product: product._id,
        quantity,
        priceAtPurchase: product.price,
      });
      total += product.price * quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total,
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function getOrders(req, res, next) {
  try {
    const filter = {};
    if (req.user.role !== 'admin') {
      filter.user = req.user.id;
    }
    const orders = await Order.find(filter).populate('items.product');
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Доступ заборонено' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getOrders, getOrder, updateStatus };

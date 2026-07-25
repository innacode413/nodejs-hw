const User = require('../models/userModel');

async function getAll(req, res) {
  const users = await User.find();
  res.json(users);
}

async function getOne(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
}

async function create(req, res) {
  const user = await User.create(req.body);
  res.status(201).json(user);
}

async function update(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
}

async function remove(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ message: 'User deleted' });
}

module.exports = { getAll, getOne, create, update, remove };

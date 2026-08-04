const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeUser(user) {
  const obj = user.toObject();
  delete obj.password;
  return obj;
}

async function issueTokens(userId, role) {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_TTL || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_TTL || '7d' }
  );

  const payload = jwt.decode(refreshToken);
  await RefreshToken.create({
    token: refreshToken,
    user: userId,
    expiresAt: new Date(payload.exp * 1000),
  });

  return { accessToken, refreshToken };
}

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, пароль і ім\'я обов\'язкові' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Невалідний формат email' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Пароль має містити щонайменше 8 символів' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Користувач з таким email вже існує' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
      name,
      role: 'user', // роль admin через реєстрацію отримати неможливо
    });

    res.status(201).json(sanitizeUser(user));
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email і пароль обов\'язкові' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    const valid = user && await bcrypt.compare(password, user.password);

    if (!user || !valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = await issueTokens(user._id, user.role);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }
    res.json(sanitizeUser(user));
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'Refresh-токен не надано' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Невалідний або прострочений refresh-токен' });
    }

    const stored = await RefreshToken.findOne({ token });
    if (!stored) {
      return res.status(401).json({ error: 'Refresh-токен більше не дійсний' });
    }

    await stored.deleteOne();

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    const { accessToken, refreshToken } = await issueTokens(user._id, user.role);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await RefreshToken.deleteOne({ token });
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Ви вийшли з системи' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me, refresh, logout };

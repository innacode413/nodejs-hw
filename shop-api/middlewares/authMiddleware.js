const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Токен не надано' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Термін дії токена закінчився' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Невалідний токен' });
    }
    next(err);
  }
}

module.exports = authMiddleware;

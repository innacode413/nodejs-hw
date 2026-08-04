function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Невалідний ID: ${err.value}` });
  }

  if (err.name === 'ValidationError') {
    const fields = Object.entries(err.errors).reduce((acc, [key, val]) => {
      acc[key] = val.message;
      return acc;
    }, {});
    return res.status(400).json({ error: 'Помилка валідації', fields });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `Значення '${err.keyValue[field]}' для поля '${field}' вже існує` });
  }

  res.status(500).json({ error: 'Щось пішло не так!' });
}

module.exports = errorHandler;

module.exports = function (req, res, next) {
  res.status(404).json({ error: { message: 'Not Found' } });
};

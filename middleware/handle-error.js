const ResponseError = require('../errors/ResponseError');

module.exports = (err, req, res, next) => {
  console.error(err);

  let status = 500;
  let data = { message: err.message };

  if (err instanceof ResponseError) {
    status = err.status;
    data = err.data;
  }

  res.status(status).json({ error: data });
};

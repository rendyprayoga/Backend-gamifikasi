const ResponseError = require('../../errors/ResponseError');
const Api = require('../../models/api');

module.exports = async (req, res, next) => {
  const key = req.headers['x-api-key'];

  if (!key) throw new ResponseError(403, 'Forbidden');

  const api = await Api.findOne({ where: { key } });

  if (!api) throw new ResponseError(403, 'Forbidden');
  req.app = api;
  next();
};

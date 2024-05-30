const jwt = require('jsonwebtoken');
const config = require('../../config');
const { publicTokenManager } = require('../../auth/token-manager');
const Person = require('../../models/person');
const sequelize = require('../../sequelize');

const getToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  return token;
};

const findPerson = async (id) => {
  return await Person.findByPk(id, {
    attributes: [
      'id',
      'referalFrom',
      'referalCode',
      'phone',
      'cigarette',
      'city',
      'dob',
      'email',
      'gender',
      'gateId',
      'job',
      'name',
      'point',
      'address',
      'score',
    ],
  });
};

const middleware = async (req, res, next) => {
  try {
    const token = getToken(req);
    const decoded = jwt.verify(token, config.app.key);

    if (!decoded) return res.sendStatus(401);

    if (!publicTokenManager.isaccessValid(decoded.id, token)) {
      return res.status(403).json({
        error: { code: 'TokenInvalidError', message: 'Token is invalid' },
      });
    }

    const person = await findPerson(decoded.id);
    req.person = person;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ error: { code: err.name, message: err.message, detail: err } });
  }
};

module.exports = middleware;

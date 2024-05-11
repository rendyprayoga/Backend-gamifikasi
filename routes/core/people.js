const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const access = require('../../middleware/public/access');
const People = require('../../models/person');
const hash = require('../../utils/hash');

const indexAction = async (req, res, next) => {
  if (req.query._search) {
    req.query._search = hash.encrypt(req.query._search);
  }
  const result = await People.findAndPaginateAll(req.query);
  res.json(result);
};

const indexAll = async (req, res, next) => {
  if (req.query._search) {
    req.query._search = hash.encrypt(req.query._search);
  }
  const result = await People.findAll(req.query);
  res.json({ data: result });
};

const showAction = async (req, res, next) => {
  const user = await People.findByPk(req.params.id);

  if (!user) return next();

  res.json({ data: user });
};
router.get('/show', access, indexAll);

router.use(authenticate);

router.get('/', authorize('people.read'), indexAction);
router.get('/:id', authorize('people.read'), showAction);

module.exports = router;

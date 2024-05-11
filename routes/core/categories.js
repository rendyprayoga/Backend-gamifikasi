const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const ActivityLog = require('../../models/activitylog');
const Categories = require('../../models/category');
const { Sequelize } = require('sequelize');

const indexAction = async (req, res, next) => {
  const result = await Categories.findAndPaginateAll(req.query);
  res.json(result);
};

const randomAction = async (req, res, next) => {
  const result = await Categories.findOne({
    order: Sequelize.literal('rand()'),
  });
  res.json({ data: result });
};

const storeAction = async (req, res, next) => {
  const input = req.validated;
  const category = await Categories.create(input);

  ActivityLog.create({
    userId: req.user.id,
    type: 'categories.create',
    key: category.id,
    data: input,
  });
  return res.json({ data: category });
};

const showAction = async (req, res, next) => {
  const category = await Categories.findByPk(req.params.id);

  if (!category) return next();

  return res.json({ data: category });
};

const updateAction = async (req, res, next) => {
  const category = await Categories.findByPk(req.params.id);
  const input = { ...req.validated };

  if (!req.user.can('categories.update')) {
    if (req.user.id !== category.id) {
      return res.status(403).json({ error: { message: 'Forbidden' } });
    } else {
      input.roleId = req.user.roleId;
    }
  }

  if (!category) return next();

  await category.update(input);

  ActivityLog.create({
    userId: req.user.id,
    type: 'stories.update',
    key: category.id,
    data: input,
  });
  return res.json({ data: category });
};

const destroyAction = async (req, res, next) => {
  const category = await Categories.findByPk(req.params.id);
  if (!category) return next();
  await category.destroy();
  ActivityLog.create({
    userId: req.user.id,
    type: 'stories.delete',
    key: category.id,
    data: category.toJSON(),
  });
  return res.status(204).end();
};

router.use(authenticate);

router.get('/', indexAction);
router.post(
  '/',
  authorize('categories.create'),
  validate(Categories.getValidator()),
  storeAction
);
router.get('/:id', authorize('categories.read'), showAction);
router.put(
  '/:id',
  authorize('categories.update'),
  validate(Categories.getValidator()),
  updateAction
);
router.delete('/:id', authorize('categories.delete'), destroyAction);

module.exports = router;
module.exports.indexAction = randomAction;

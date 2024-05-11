const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const ActivityLog = require('../../models/activitylog');
const Role = require('../../models/role');
const User = require('../../models/user');

const indexAction = async (req, res, next) => {
  const result = await User.findAndPaginateAll(req.query, { include: Role });
  res.json(result);
};

const storeAction = async (req, res, next) => {
  const input = req.validated;
  const user = await User.create(input);

  res.json({ data: user });
  ActivityLog.create({
    userId: req.user.id,
    type: 'users.create',
    key: user.id,
    data: input,
  });
};

const showAction = async (req, res, next) => {
  const user = await User.findByPk(req.params.id, { include: Role });

  if (!user) return next();

  res.json({ data: user });
};

const updateAction = async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  const input = { ...req.validated };

  if (!req.user.can('users.update')) {
    if (req.user.id !== user.id) {
      return res.status(403).json({ error: { message: 'Forbidden' } });
    } else {
      input.roleId = req.user.roleId;
    }
  }

  if (!user) return next();

  await user.update(input);
  res.json({ data: user });
  ActivityLog.create({
    userId: req.user.id,
    type: 'users.update',
    key: user.id,
    data: input,
  });
};

const destroyAction = async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) return next();

  await user.destroy();
  res.status(204).end();
  ActivityLog.create({
    userId: req.user.id,
    type: 'users.delete',
    key: user.id,
    data: user.toJSON(),
  });
};

router.use(authenticate);

router.get('/', authorize('users.read'), indexAction);
router.post(
  '/',
  authorize('users.create'),
  validate(User.getValidator()),
  storeAction
);
router.get('/:id', authorize('users.read'), showAction);
router.put(
  '/:id',
  validate(User.getValidator(User.SCENARIO_UPDATE)),
  updateAction
);
router.delete('/:id', authorize('users.delete'), destroyAction);

module.exports = router;

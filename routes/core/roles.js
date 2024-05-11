const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const ActivityLog = require('../../models/activitylog');
const Role = require('../../models/role');

const indexAction = async (req, res, next) => {
  const result = await Role.findAndPaginateAll(req.query);
  res.json(result);
};

const storeAction = async (req, res, next) => {
  const input = req.validated
  const role = await Role.create(input);

  res.json({ data: role });
  ActivityLog.create({
    userId: req.user.id,
    type: 'roles.create',
    key: role.id,
    data: input,
  });
};

const showAction = async (req, res, next) => {
  const role = await Role.findByPk(req.params.id);
  
  if (!role) return next();

  res.json({ data: role });
};

const updateAction = async (req, res, next) => {
  const input = req.validated
  const role = await Role.findByPk(req.params.id);

  if (!role) return next();

  await role.update(input);
  res.json({ data: role });
  ActivityLog.create({
    userId: req.user.id,
    type: 'roles.update',
    key: role.id,
    data: input,
  });
};

const destroyAction = async (req, res, next) => {
  const role = await Role.findByPk(req.params.id);

  if (!role) return next();

  await role.destroy();
  res.status(204).end();
  ActivityLog.create({
    userId: req.user.id,
    type: 'roles.delete',
    key: role.id,
    data: role.toJSON(),
  });
};

const modulesIndexAction = (req, res, next) => {
  res.json({ data: Role.MODULES });
};

router.use(authenticate);

router.get('/', authorize('roles.read'), indexAction);
router.get('/modules', authorize('roles.read'), modulesIndexAction);
router.get('/:id', authorize('roles.read'), showAction);
router.post(
  '/',
  validate(Role.getValidator()),
  authorize('roles.create'),
  storeAction
);
router.put(
  '/:id',
  validate(Role.getValidator()),
  authorize('roles.update'),
  updateAction
);
router.delete('/:id', authorize('roles.delete'), destroyAction);

module.exports = router;

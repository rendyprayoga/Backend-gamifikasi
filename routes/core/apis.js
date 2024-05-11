const express = require('express');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const ActivityLog = require('../../models/activitylog');
const Api = require('../../models/api');

const indexAction = async (req, res, next) => {
  const result = await Api.findAndPaginateAll(req.query);
  res.json(result);
};

const showAction = async (req, res, next) => {
  const result = await Api.findByPk(req.params.id);
  res.json({ data: result });
};

const storeAction = async (req, res, next) => {
  const input = req.validated;
  const api = await Api.create(input);

  res.json({ data: api });
  ActivityLog.create({
    userId: req.user.id,
    type: 'apis.create',
    key: api.id,
    data: input,
  });
};

const destroyAction = async (req, res, next) => {
  const api = await Api.findByPk(req.params.id);

  if (!api) return next();

  await api.destroy();
  res.status(204).end();
  ActivityLog.create({
    userId: req.user.id,
    type: 'apis.delete',
    key: api.id,
    data: api.toJSON(),
  });
};

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('apis.read'), indexAction);
router.post(
  '/',
  validate(Api.getValidator()),
  authorize('apis.create'),
  storeAction
);
router.delete('/:id', authorize('apis.delete'), destroyAction);
router.get('/:id', authorize('apis.read'), showAction);

module.exports = router;

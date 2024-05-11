const express = require('express');
const authenticate = require('../../middleware/authenticate');
const validate = require('../../middleware/validate');
const ActivityLog = require('../../models/activitylog');
const Role = require('../../models/role');
const Setting = require('../../models/setting');
const { Op } = require('sequelize');

const indexAction = async (req, res, next) => {
  let settings;
  if (req.query.key_setting === 'notnull') {
    settings = await Setting.findAll({
      where: { settingType: { [Op.ne]: null } },
    });
  } else {
    settings = await Setting.findAll({
      where: Setting.parseWhereQuery(req.query),
    });
  }
  res.json({ data: settings });
};
const indexActionByType = async (req, res, next) => {
  let settings;
  if (req.query.key_setting === 'notnull') {
    settings = await Setting.findAll({
      where: { settingType: { [Op.ne]: null } },
    });
  } else {
    settings = await Setting.findAll({
      where: Setting.parseWhereQuery(req.query),
    });
  }
  res.json({ data: settings });
};
const indexActionByID = async (req, res, next) => {
  let settings = await Setting.findOne({
    where: { id: req.params.id },
  });
  res.json({ data: settings });
};

const storeAction = async (req, res, next) => {
  const input = req.validated;
  const settings = await Setting.create(input);

  res.json({ data: settings });
  ActivityLog.create({
    userId: req.user.id,
    type: 'settings.create',
    key: settings.id,
    data: input,
  });
};

const updateAction = async (req, res, next) => {
  const key = req.params.key;
  const input = req.validated;
  let setting = await Setting.findOne({ where: { key } });
  setting = setting || new Setting();

  const authorize = () => {
    const modules = Role.MODULES.map(({ code }) => code);

    if (modules.includes(key) && !req.user.can(`${key}.update`)) return false;

    return true;
  };

  if (authorize()) {
    Object.assign(setting, input);
    await setting.save();
    res.json({ data: setting });
    ActivityLog.create({
      userId: req.user.id,
      type: 'settings.update',
      key: setting.key,
      data: input,
    });
  } else {
    res.status(403).json({ error: { message: 'Permission denied' } });
  }
};

const destroyAction = async (req, res, next) => {
  const settings = await Setting.findByPk(req.params.id);

  if (!settings) return next();

  await settings.destroy();
  res.status(204).end();
  ActivityLog.create({
    userId: req.user.id,
    type: 'settings.delete',
    key: settings.id,
    data: settings.toJSON(),
  });
};

const router = express.Router();

router.use(authenticate);

router.get('/', indexAction);
router.post('/', validate(Setting.getValidator()), storeAction);
router.get('/:settingType', indexActionByType);
router.get('/:id/byid', indexActionByID);
router.delete('/:id', destroyAction);

router.put('/:key', validate(Setting.getValidator()), updateAction);

module.exports = router;
module.exports.indexAction = indexAction;

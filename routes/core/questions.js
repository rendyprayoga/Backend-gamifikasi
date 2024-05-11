const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const ActivityLog = require('../../models/activitylog');
const Category = require('../../models/category');
const Question = require('../../models/question');
const Answer = require('../../models/answer');
const { Sequelize, where } = require('sequelize');
const Submission = require('../../models/submission');

const indexAction = async (req, res, next) => {
  let attrQuestion = null;
  const result = await Question.findAndPaginateAll(req.query, {
    attributes: attrQuestion,
    order: [['id', 'asc']],
  });
  res.json(result);
};

const indexActionStudent = async (req, res, next) => {
  let attrQuestion = null;
  const result = await Question.findAndPaginateAll(req.query, {
    attributes: attrQuestion,
    include: [{ model: Answer, attributes: ['answerText', 'id'] }],
    order: [['id', 'asc']],
    where: { categoryId: req.params.id },
  });
  res.json(result);
};

const storeExam = async (req, res, next) => {
  const input = req.body;
  let score = 0,
    point = 0;
  const promise = input.map(async (val) => {
    const Answers = await Answer.findOne({
      where: { questionId: val.id, id: val.answer },
      order: [['id', 'asc']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'categoryId', 'deletedAt'],
      },
    });
    if (Answers.getDataValue('isTrue')) {
      point += 10;
    }
    return Answers;
  });
  const data = await Promise.all(promise).then((result) => {
    return result;
  });
  score = (point / input.length) * 10;
  const submission = await Submission.findOne({
    where: { categoryId: req.params.categoryId, userId: req.user.id },
  });
  if (!submission) {
    await Submission.create({
      categoryId: req.params.categoryId,
      userId: req.user.id,
      score,
    });
  } else {
    return res
      .status(400)
      .json({ error: { message: 'Category sudah pernah dikerjakan' } });
  }
  return res.json(data);
};

const getQuestionsAction = async (req, res, next) => {
  const result = await Question.findAll({
    where: {
      categoryId: req.params.categoryId,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'categoryId', 'deletedAt'],
    },
    limit: 10,
    order: [[Sequelize.literal('RAND()')]],
  });
  const promise = result.map(async (val) => {
    const Answers = await Answer.findAll({
      where: { questionId: val.id },
      order: [['id', 'asc']],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'categoryId', 'deletedAt'],
      },
    });
    return { ...val.dataValues, Answers };
  });
  const data = await Promise.all(promise).then((result) => {
    return result;
  });
  res.json({ data });
};

const storeAction = async (req, res, next) => {
  const input = req.validated;
  const question = await Question.create(input);

  ActivityLog.create({
    userId: req.user.id,
    type: 'questions.create',
    key: question.id,
    data: input,
  });
  return res.json({ data: question });
};

const showAction = async (req, res, next) => {
  let attrQuestion = null;
  let isAnswered = false;

  const question = await Question.findByPk(req.params.id, {
    include: [{ model: Category, attributes: ['id', 'name'] }],
    attributes: attrQuestion,
  });
  if (!question) return next();
  question.setDataValue('isAnswered', isAnswered);
  return res.json({ data: question });
};

const updateAction = async (req, res, next) => {
  const question = await Question.findByPk(req.params.id);
  const input = { ...req.validated };

  if (!req.user.can('questions.update')) {
    if (req.user.id !== question.id) {
      return res.status(403).json({ error: { message: 'Forbidden' } });
    } else {
      input.roleId = req.user.roleId;
    }
  }

  if (!question) return next();

  await question.update(input);

  ActivityLog.create({
    userId: req.user.id,
    type: 'questions.update',
    key: question.id,
    data: input,
  });
  return res.json({ data: question });
};

const destroyAction = async (req, res, next) => {
  const question = await Question.findByPk(req.params.id);
  if (!question) return next();
  await question.destroy();
  ActivityLog.create({
    userId: req.user.id,
    type: 'questions.delete',
    key: question.id,
    data: question.toJSON(),
  });
  return res.status(204).end();
};

router.use(authenticate);

router.get('/', authorize('questions.read'), indexAction);

router.get('/student/:id', indexActionStudent);

router.post('/student/:categoryId', storeExam);

router.post(
  '/',
  authorize('questions.create'),
  validate(Question.getValidator()),
  storeAction
);

router.get('/:id', authorize('questions.read'), showAction);

router.put(
  '/:id',
  authorize('questions.update'),
  validate(Question.getValidator()),
  updateAction
);

router.delete('/:id', authorize('questions.delete'), destroyAction);

module.exports = router;
module.exports.indexAction = indexAction;
module.exports.showAction = showAction;
module.exports.getQuestions = getQuestionsAction;

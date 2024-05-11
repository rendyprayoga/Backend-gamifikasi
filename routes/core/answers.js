const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const Answer = require('../../models/answer');

const indexAction = async (req, res, next) => {
  let attrArr = null;

  const result = await Answer.findAll({
    where: { questionId: req.params.id },
    attributes: attrArr,
  });
  res.json({ data: result });
};

const storeAction = async (req, res, next) => {
  const input = req.validated;
  const answer = await Answer.bulkCreate(input.data, {
    updateOnDuplicate: ['answerText', 'isTrue'],
  });
  return res.json({ data: answer });
};

router.use(authenticate);

router.get('/:id', authorize('questions.read'), indexAction);

router.post(
  '/',
  authorize('questions.create'),
  validate(Answer.getValidator()),
  storeAction
);

module.exports = router;
module.exports.indexAction = indexAction;

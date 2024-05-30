const jwt = require('jsonwebtoken');
const config = require('../config');
const Role = require('../models/role');
const User = require('../models/user');
const Submission = require('../models/submission');
const Categories = require('../models/category');
const { coreTokenManager } = require('../auth/token-manager');

module.exports = async (req, res, next) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, config.app.key);

    if (!coreTokenManager.isaccessValid(decoded.id, token)) {
      return res.status(403).json({
        error: { code: 'TokenInvalidError', message: 'Token is invalid' },
      });
    }

    const user = await User.findByPk(decoded.id, { include: Role });

    if (!user) throw new Error('Forbidden');
    const totalKategori = await Categories.count();
    const totalSubmission = await Submission.sum('score', {
      where: { userId: user.id },
    });
    const score = totalSubmission / totalKategori;
    console.log(totalKategori, totalSubmission);
    req.user = user;
    req.user.avg_score = score;
    console.log(score);
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ error: { code: err.name, message: `${err.message} - Error` } });
  }
};

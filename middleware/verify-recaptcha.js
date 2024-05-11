const axios = require('axios');
const querystring = require('querystring');
const config = require('../config');

module.exports = async (req, res, next) => {
  if (process.env._RECAPTCHA_DISABLE) return next();

  try {
    const data = await axios
      .post(
        'https://www.google.com/recaptcha/api/siteverify',
        querystring.stringify({
          secret: config.recaptcha.secret,
          response: req.body['g-recaptcha-response'],
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then(({ data }) => data);

    if (!data.success) throw new Error('Invalid reCAPTCHA token');
    else if (data.score < 0.5) throw new Error('Spam detected');

    next();
  } catch (error) {
    res.status(400).json({
      error: { message: error.message },
    });
  }
};

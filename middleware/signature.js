const signed = require('signed').default;
const config = require('../config');

const signature = signed({
  secret: config.app.key,
  ttl: 10 * 60, // 10 minutes
});

module.exports = signature;

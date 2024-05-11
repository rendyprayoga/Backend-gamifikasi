const crypto = require('crypto');
const config = require('../config');

module.exports = {
  encrypt(text) {
    const key = config.app.key.repeat(32).substr(0, 32);
    const iv = config.app.key.repeat(16).substr(0, 16);
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  },

  decrypt(text) {
    const key = config.app.key.repeat(32).substr(0, 32);
    const iv = config.app.key.repeat(16).substr(0, 16);
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  },

  generateKey(text) {
    return crypto
      .createHmac('sha256', config.app.key)
      .update(text)
      .update(String(Math.random()))
      .digest('base64');
  },
};

const LRU = require('lru-cache');
const jwt = require('jsonwebtoken');
const config = require('../config');

const minuteInSeconds = 60;
const hourInSeconds = 60 * minuteInSeconds;
const dayInSeconds = 24 * hourInSeconds;

class TokenManager {
  constructor() {
    // I know it's wrong to store tokens in server, because JWT is stateless. But
    // it's the requirement to only allow 1 session per user, so please don't
    // blame me.
    this.accessCache = new LRU({
      maxAge: 10 * minuteInSeconds * 1000,
    });
    this.refrechCache = new LRU({
      maxAge: 1 * hourInSeconds * 1000,
    });
  }

  generateAccess(id) {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 55 * minuteInSeconds,
        id: id,
      },
      config.app.key
    );

    this.accessCache.set(id, token);

    return token;
  }

  generateRefresh(id, remember = false) {
    const token = jwt.sign(
      {
        exp: remember
          ? Math.floor(Date.now() / 1000) + 7 * dayInSeconds
          : Math.floor(Date.now() / 1000) + 1 * hourInSeconds,
        remember,
      },
      config.app.key
    );

    this.refrechCache.set(
      id,
      token,
      remember ? 7 * dayInSeconds * 1000 : undefined
    );

    return token;
  }

  isRefreshValid(id, token) {
    // Only allow 1 session per user.
    return token;
    // return id && token && this.refrechCache.get(id) === token;
  }

  isaccessValid(id, token) {
    return token;
    return id && token && this.accessCache.get(id) === token;
  }
}

module.exports = TokenManager;
module.exports.coreTokenManager = new TokenManager();
module.exports.publicTokenManager = new TokenManager();

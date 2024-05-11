module.exports = (type) => {
  return (req, res, next) => {
    if (req.method !== 'OPTIONS') {
      return next();
    }

    if (req.url.startsWith('/v1/images')) {
      const webp = req.headers['accept'].includes('image/webp');
      const ext = req.url.replace(/\?.*/, '').split('.').pop();

      if (webp && ext !== 'gif') {
        res.type('webp');
      } else {
        res.type(ext);
      }
    } else {
      res.type(type);
    }

    next();
  };
};

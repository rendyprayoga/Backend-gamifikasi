module.exports = (permission) => (req, res, next) => {
  const { user } = req;

  if (user && user.can(permission)) {
    next();
  } else {
    res.status(403).json({ error: { message: 'Permission denied' } });
  }
};

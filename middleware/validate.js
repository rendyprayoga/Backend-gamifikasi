module.exports = (validator) => async (req, res, next) => {
  try {
    const value = { ...req.body, ...req.params };

    await validator.validate(value, { abortEarly: false });

    req.validated = validator.cast(value);
  } catch (error) {
    console.error(error);

    if (error.errors) {
      return res
        .status(422)
        .json({ error: { code: error.name, message: error.errors[0] } });
    } else {
      return res.status(500).json({ error: { message: error.message } });
    }
  }

  next();
};

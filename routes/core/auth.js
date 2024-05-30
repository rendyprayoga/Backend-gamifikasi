const express = require('express');
const { coreTokenManager } = require('../../auth/token-manager');
const ActivityLog = require('../../models/activitylog');
const User = require('../../models/user');
const authenticate = require('../../middleware/authenticate');
const validate = require('../../middleware/validate');

const router = express.Router();

// Middleware untuk validasi input login
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: { message: 'username dan password harus diisi' },
    });
  }

  next(); // Lanjut ke middleware atau handler berikutnya jika validasi berhasil
};

// Aksi login untuk pengguna
const loginAction = async (req, res, next) => {
  const user = await User.scope('withPassword').findOne({
    where: { email: req.body.email },
  });

  if (!user || !user.isPasswordValid(req.body.password)) {
    return res
      .status(400)
      .json({ error: { message: 'username dan password tidak cocok' } });
  }

  const accessToken = coreTokenManager.generateAccess(user.id);
  const refreshToken = coreTokenManager.generateRefresh(user.id);

  res.json({ data: { id: user.id, accessToken, refreshToken } });

  // Catat aktivitas login
  await ActivityLog.create({
    userId: user.id,
    type: 'auth.login',
  });
};

// Aksi untuk mendapatkan informasi pengguna
const meAction = async (req, res, next) => {
  res.json({ data: req.user });
};

// Aksi untuk memperbarui token
const refreshTokenAction = async (req, res, next) => {
  const id = req.body.id;
  const refreshToken = req.body.refreshToken;

  if (coreTokenManager.isRefreshValid(id, refreshToken)) {
    const accessToken = coreTokenManager.generateAccess(id);
    const refreshToken = coreTokenManager.generateRefresh(id);

    return res.json({ data: { id, accessToken, refreshToken } });
  } else {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }
};

// Rute login dengan validasi dan aksi login
router.post(
  '/login',
  validateLoginInput, // Validasi input login
  loginAction // Proses login
);

// Rute untuk mendapatkan informasi pengguna
router.get('/me', authenticate, meAction);

// Rute untuk memperbarui token
router.post('/refresh-token', refreshTokenAction);

module.exports = router;

const asyncHandler = require('../utils/asyncHandler');
const { login, register, profile } = require('../services/authService');

const loginHandler = asyncHandler(async (req, res) => {
  const result = await login(req.body);
  res.json({ success: true, data: result });
});

const registerHandler = asyncHandler(async (req, res) => {
  const result = await register(req.body);
  res.status(201).json({ success: true, data: result });
});

const profileHandler = asyncHandler(async (req, res) => {
  const result = await profile(req.user.id);
  res.json({ success: true, data: result });
});

module.exports = { loginHandler, registerHandler, profileHandler };

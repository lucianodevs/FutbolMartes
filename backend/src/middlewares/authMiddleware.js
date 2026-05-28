const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');
const { findUserById } = require('../models/userModel');

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No autorizado'));
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);

    if (!user) {
      return next(new ApiError(401, 'No autorizado'));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new ApiError(401, 'Token inválido o expirado'));
  }
}

module.exports = { protect };

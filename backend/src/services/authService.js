const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');
const { createUser, findUserByEmail, findUserById } = require('../models/userModel');

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    created_at: user.created_at,
  };
}

async function register(payload) {
  const { nombre, email, password } = payload;

  if (!nombre || !email || !password) {
    throw new ApiError(400, 'Nombre, email y password son obligatorios');
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new ApiError(409, 'Ya existe un usuario con ese email');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = await createUser({ nombre, email, password: passwordHash, rol: 'admin' });
  const user = await findUserById(id);
  const token = signToken({ id: user.id, email: user.email, rol: user.rol });

  return { user: sanitizeUser(user), token };
}

async function login(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw new ApiError(400, 'Email y password son obligatorios');
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const token = signToken({ id: user.id, email: user.email, rol: user.rol });
  return { user: sanitizeUser(user), token };
}

async function profile(userId) {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, 'Usuario no encontrado');
  }
  return sanitizeUser(user);
}

module.exports = { register, login, profile };

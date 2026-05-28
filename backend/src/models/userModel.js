const { pool } = require('../config/db');

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.query('SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function createUser({ nombre, email, password, rol = 'admin' }) {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, password, rol]
  );
  return result.insertId;
}

async function updateUserByEmail(email, { nombre, password, rol = 'admin' }) {
  const [result] = await pool.query(
    'UPDATE usuarios SET nombre = ?, password = ?, rol = ? WHERE email = ?',
    [nombre, password, rol, email]
  );
  return result.affectedRows;
}

async function countUsers() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
  return rows[0].total;
}

module.exports = { findUserByEmail, findUserById, createUser, updateUserByEmail, countUsers };

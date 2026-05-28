const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail, updateUserByEmail } = require('../models/userModel');

async function seedAdminIfNeeded() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@futbol.com';
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10);

  const existing = await findUserByEmail(adminEmail);
  if (existing) {
    await updateUserByEmail(adminEmail, {
      nombre: process.env.ADMIN_NAME || 'Administrador',
      password: passwordHash,
      rol: 'admin',
    });

    return { id: existing.id, email: adminEmail };
  }

  const id = await createUser({
    nombre: process.env.ADMIN_NAME || 'Administrador',
    email: adminEmail,
    password: passwordHash,
    rol: 'admin',
  });

  return { id, email: adminEmail };
}

module.exports = { seedAdminIfNeeded };

const { pool } = require('../config/db');

async function ensureMvpColumn() {
  const [columnRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'partidos'
       AND COLUMN_NAME = 'mvp_jugador_id'`
  );

  if (Number(columnRows[0]?.total || 0) > 0) {
    return;
  }

  await pool.query('ALTER TABLE partidos ADD COLUMN mvp_jugador_id INT NULL AFTER observaciones');
  await pool.query('ALTER TABLE partidos ADD CONSTRAINT fk_partidos_mvp FOREIGN KEY (mvp_jugador_id) REFERENCES jugadores(id) ON DELETE SET NULL');
}

async function runMigrations() {
  await ensureMvpColumn();
}

module.exports = { runMigrations };

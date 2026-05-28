const { pool } = require('../config/db');

function buildOrderBy(sortBy = 'goles', order = 'desc') {
  const allowed = new Set(['goles', 'presencias', 'sanciones', 'pecheras_llevadas', 'pecheras_sin_lavar', 'nombre', 'apellido', 'id']);
  const safeSort = allowed.has(sortBy) ? sortBy : 'goles';
  const safeOrder = String(order).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  return `ORDER BY ${safeSort} ${safeOrder}`;
}

async function findPlayers({ search = '', team = '', sortBy = 'goles', order = 'desc', limit = 10, offset = 0 }) {
  const where = [];
  const params = [];

  if (search) {
    where.push('(nombre LIKE ? OR apellido LIKE ? OR equipo LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  if (team) {
    where.push('equipo = ?');
    params.push(team);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const orderClause = buildOrderBy(sortBy, order);
  const [rows] = await pool.query(
    `SELECT * FROM jugadores ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM jugadores ${whereClause}`, params);
  return { rows, total: countRows[0].total };
}

async function findPlayerById(id) {
  const [rows] = await pool.query('SELECT * FROM jugadores WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function createPlayer(data) {
  const [result] = await pool.query(
    `INSERT INTO jugadores
      (nombre, apellido, equipo, goles, presencias, sanciones, pecheras_llevadas, pecheras_sin_lavar, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.nombre,
      data.apellido,
      data.equipo,
      data.goles,
      data.presencias,
      data.sanciones,
      data.pecheras_llevadas,
      data.pecheras_sin_lavar,
      data.created_by || null,
    ]
  );
  return result.insertId;
}

async function updatePlayer(id, data) {
  const [result] = await pool.query(
    `UPDATE jugadores SET
      nombre = ?,
      apellido = ?,
      equipo = ?,
      goles = ?,
      presencias = ?,
      sanciones = ?,
      pecheras_llevadas = ?,
      pecheras_sin_lavar = ?
     WHERE id = ?`,
    [
      data.nombre,
      data.apellido,
      data.equipo,
      data.goles,
      data.presencias,
      data.sanciones,
      data.pecheras_llevadas,
      data.pecheras_sin_lavar,
      id,
    ]
  );
  return result.affectedRows;
}

async function deletePlayer(id) {
  const [result] = await pool.query('DELETE FROM jugadores WHERE id = ?', [id]);
  return result.affectedRows;
}

async function getAggregates() {
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) AS totalJugadores,
      COALESCE(SUM(goles), 0) AS totalGoles,
      COALESCE(SUM(presencias), 0) AS totalPresencias,
      COALESCE(SUM(sanciones), 0) AS totalSanciones,
      COALESCE(SUM(pecheras_llevadas), 0) AS totalPecherasLlevadas,
      COALESCE(SUM(pecheras_sin_lavar), 0) AS totalPecherasSinLavar
    FROM jugadores
  `);
  return rows[0];
}

async function findTopScorer() {
  const [rows] = await pool.query('SELECT * FROM jugadores ORDER BY goles DESC, presencias DESC LIMIT 1');
  return rows[0] || null;
}

async function findMostPresences() {
  const [rows] = await pool.query('SELECT * FROM jugadores ORDER BY presencias DESC, goles DESC LIMIT 1');
  return rows[0] || null;
}

async function findMostSanctions() {
  const [rows] = await pool.query('SELECT * FROM jugadores ORDER BY sanciones DESC, goles DESC LIMIT 1');
  return rows[0] || null;
}

module.exports = {
  findPlayers,
  findPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getAggregates,
  findTopScorer,
  findMostPresences,
  findMostSanctions,
};

const { pool } = require('../config/db');

function buildMatchWhere({ team = '', result = '', search = '' }) {
  const where = [];
  const params = [];

  if (team) {
    where.push('(equipo_local = ? OR equipo_visitante = ?)');
    params.push(team, team);
  }

  if (result) {
    where.push('ganador = ?');
    params.push(result);
  }

  if (search) {
    where.push('(observaciones LIKE ? OR equipo_local LIKE ? OR equipo_visitante LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  return { where, params };
}

async function findMatches({ team = '', result = '', search = '', limit = 10, offset = 0 }) {
  const { where, params } = buildMatchWhere({ team, result, search });
  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT
      partidos.*,
      jugadores.nombre AS mvp_nombre,
      jugadores.apellido AS mvp_apellido
     FROM partidos
     LEFT JOIN jugadores ON jugadores.id = partidos.mvp_jugador_id
     ${whereClause}
     ORDER BY fecha DESC, id DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM partidos ${whereClause}`, params);
  return { rows, total: countRows[0].total };
}

async function findMatchById(id) {
  const [rows] = await pool.query(
    `SELECT
      partidos.*,
      jugadores.nombre AS mvp_nombre,
      jugadores.apellido AS mvp_apellido
     FROM partidos
     LEFT JOIN jugadores ON jugadores.id = partidos.mvp_jugador_id
     WHERE partidos.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function createMatch(data) {
  const [result] = await pool.query(
    `INSERT INTO partidos
      (fecha, equipo_local, equipo_visitante, goles_local, goles_visitante, ganador, observaciones, mvp_jugador_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.fecha,
      data.equipo_local,
      data.equipo_visitante,
      data.goles_local,
      data.goles_visitante,
      data.ganador,
      data.observaciones || null,
      data.mvp_jugador_id || null,
      data.created_by || null,
    ]
  );
  return result.insertId;
}

async function updateMatch(id, data) {
  const [result] = await pool.query(
    `UPDATE partidos SET
      fecha = ?,
      equipo_local = ?,
      equipo_visitante = ?,
      goles_local = ?,
      goles_visitante = ?,
      ganador = ?,
      observaciones = ?,
      mvp_jugador_id = ?
     WHERE id = ?`,
    [
      data.fecha,
      data.equipo_local,
      data.equipo_visitante,
      data.goles_local,
      data.goles_visitante,
      data.ganador,
      data.observaciones || null,
      data.mvp_jugador_id || null,
      id,
    ]
  );
  return result.affectedRows;
}

async function deleteMatch(id) {
  const [result] = await pool.query('DELETE FROM partidos WHERE id = ?', [id]);
  return result.affectedRows;
}

async function getMatchStats() {
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) AS totalPartidos,
      SUM(CASE WHEN ganador = 'Dictadores' THEN 1 ELSE 0 END) AS victoriasDictadores,
      SUM(CASE WHEN ganador = 'Tramposos' THEN 1 ELSE 0 END) AS victoriasTramposos,
      SUM(CASE WHEN ganador = 'Empate' THEN 1 ELSE 0 END) AS empates,
      COALESCE(SUM(goles_local), 0) - COALESCE(SUM(goles_visitante), 0) AS diferenciaGoles
    FROM partidos
  `);
  return rows[0];
}

async function getTotalMatches() {
  const [rows] = await pool.query('SELECT COUNT(*) AS totalPartidos FROM partidos');
  return rows[0]?.totalPartidos || 0;
}

async function getRecentMatches(limit = 5) {
  const [rows] = await pool.query(
    `SELECT
      partidos.*,
      jugadores.nombre AS mvp_nombre,
      jugadores.apellido AS mvp_apellido
     FROM partidos
     LEFT JOIN jugadores ON jugadores.id = partidos.mvp_jugador_id
     ORDER BY fecha DESC, id DESC LIMIT ?`,
    [Number(limit)]
  );
  return rows;
}

async function getTopMvps(limit = 3) {
  const [rows] = await pool.query(
    `SELECT
      jugadores.id,
      jugadores.nombre,
      jugadores.apellido,
      jugadores.equipo,
      COUNT(*) AS mvp_count
     FROM partidos
     INNER JOIN jugadores ON jugadores.id = partidos.mvp_jugador_id
     GROUP BY jugadores.id, jugadores.nombre, jugadores.apellido, jugadores.equipo
     ORDER BY mvp_count DESC, jugadores.goles DESC, jugadores.id ASC
     LIMIT ?`,
    [Number(limit)]
  );
  return rows;
}

module.exports = {
  findMatches,
  findMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  getMatchStats,
  getTotalMatches,
  getRecentMatches,
  getTopMvps,
};

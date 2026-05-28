const ExcelJS = require('exceljs');
const { pool } = require('../config/db');

async function fetchAllPlayers() {
  const [rows] = await pool.query('SELECT * FROM jugadores ORDER BY id');
  return rows;
}

async function fetchAllMatches() {
  const [rows] = await pool.query(
    `SELECT partidos.*, j.nombre AS mvp_nombre, j.apellido AS mvp_apellido
     FROM partidos
     LEFT JOIN jugadores j ON j.id = partidos.mvp_jugador_id
     ORDER BY fecha DESC, id DESC`
  );
  return rows;
}

async function fetchAllUsers() {
  const [rows] = await pool.query('SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY id');
  return rows;
}

async function generateWorkbook() {
  const [players, matches, users] = await Promise.all([
    fetchAllPlayers(),
    fetchAllMatches(),
    fetchAllUsers(),
  ]);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Futbol Stats';
  workbook.created = new Date();

  const sheetPlayers = workbook.addWorksheet('Jugadores');
  sheetPlayers.columns = [
    { header: 'ID', key: 'id', width: 8 },
    { header: 'Nombre', key: 'nombre', width: 20 },
    { header: 'Apellido', key: 'apellido', width: 20 },
    { header: 'Equipo', key: 'equipo', width: 16 },
    { header: 'Goles', key: 'goles', width: 10 },
    { header: 'Presencias', key: 'presencias', width: 12 },
    { header: 'Sanciones', key: 'sanciones', width: 12 },
    { header: 'Pecheras Llevadas', key: 'pecheras_llevadas', width: 16 },
    { header: 'Pecheras Sin Lavar', key: 'pecheras_sin_lavar', width: 16 },
    { header: 'Creado Por', key: 'created_by', width: 12 },
    { header: 'Creado', key: 'created_at', width: 20 },
  ];
  players.forEach((p) => sheetPlayers.addRow(p));

  const sheetMatches = workbook.addWorksheet('Partidos');
  sheetMatches.columns = [
    { header: 'ID', key: 'id', width: 8 },
    { header: 'Fecha', key: 'fecha', width: 16 },
    { header: 'Local', key: 'equipo_local', width: 16 },
    { header: 'Visitante', key: 'equipo_visitante', width: 16 },
    { header: 'Goles Local', key: 'goles_local', width: 12 },
    { header: 'Goles Visitante', key: 'goles_visitante', width: 14 },
    { header: 'Ganador', key: 'ganador', width: 12 },
    { header: 'MVP ID', key: 'mvp_jugador_id', width: 10 },
    { header: 'MVP Nombre', key: 'mvp_nombre', width: 20 },
    { header: 'MVP Apellido', key: 'mvp_apellido', width: 20 },
    { header: 'Observaciones', key: 'observaciones', width: 36 },
    { header: 'Creado Por', key: 'created_by', width: 12 },
    { header: 'Creado', key: 'created_at', width: 20 },
  ];
  matches.forEach((m) => sheetMatches.addRow(m));

  const sheetUsers = workbook.addWorksheet('Usuarios');
  sheetUsers.columns = [
    { header: 'ID', key: 'id', width: 8 },
    { header: 'Nombre', key: 'nombre', width: 24 },
    { header: 'Email', key: 'email', width: 32 },
    { header: 'Rol', key: 'rol', width: 12 },
    { header: 'Creado', key: 'created_at', width: 20 },
  ];
  users.forEach((u) => sheetUsers.addRow(u));

  return workbook;
}

module.exports = { generateWorkbook };

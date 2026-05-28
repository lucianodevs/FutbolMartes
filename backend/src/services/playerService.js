const ApiError = require('../utils/ApiError');
const {
  findPlayers,
  findPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getAggregates,
  findTopScorers,
  findMostPresences,
  findMostSanctions,
} = require('../models/playerModel');
const { getTotalMatches } = require('../models/matchModel');

function calculateAttendance(player, totalMatches) {
  const matchesCount = Number(totalMatches || 0);
  const presencias = Number(player.presencias || 0);

  if (matchesCount <= 0) {
    return 0;
  }

  const percentage = (presencias / matchesCount) * 100;
  return Number(Math.min(100, percentage).toFixed(2));
}

function normalizePlayer(player, totalMatches) {
  return {
    ...player,
    asistencia_porcentaje: calculateAttendance(player, totalMatches),
  };
}

function validatePlayerInput(data) {
  const requiredFields = ['nombre', 'apellido', 'equipo'];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new ApiError(400, `El campo ${field} es obligatorio`);
    }
  }
}

async function listPlayers(query) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.max(Number(query.limit || 10), 1);
  const offset = (page - 1) * limit;

  const [totalMatches, playersResult] = await Promise.all([
    getTotalMatches(),
    findPlayers({
      search: query.search || '',
      team: query.team || '',
      sortBy: query.sortBy || 'goles',
      order: query.order || 'desc',
      limit,
      offset,
    }),
  ]);

  return {
    items: playersResult.rows.map((player) => normalizePlayer(player, totalMatches)),
    meta: {
      page,
      limit,
      total: playersResult.total,
      totalPages: Math.ceil(playersResult.total / limit) || 1,
    },
  };
}

async function getPlayer(id) {
  const [totalMatches, player] = await Promise.all([getTotalMatches(), findPlayerById(id)]);

  if (!player) {
    throw new ApiError(404, 'Jugador no encontrado');
  }

  return normalizePlayer(player, totalMatches);
}

async function create(payload, userId) {
  validatePlayerInput(payload);

  const id = await createPlayer({
    nombre: payload.nombre,
    apellido: payload.apellido,
    equipo: payload.equipo,
    goles: Number(payload.goles || 0),
    presencias: Number(payload.presencias || 0),
    sanciones: Number(payload.sanciones || 0),
    pecheras_llevadas: Number(payload.pecheras_llevadas || 0),
    pecheras_sin_lavar: Number(payload.pecheras_sin_lavar || 0),
    created_by: userId,
  });

  return getPlayer(id);
}

async function update(id, payload) {
  validatePlayerInput(payload);

  const affectedRows = await updatePlayer(id, {
    nombre: payload.nombre,
    apellido: payload.apellido,
    equipo: payload.equipo,
    goles: Number(payload.goles || 0),
    presencias: Number(payload.presencias || 0),
    sanciones: Number(payload.sanciones || 0),
    pecheras_llevadas: Number(payload.pecheras_llevadas || 0),
    pecheras_sin_lavar: Number(payload.pecheras_sin_lavar || 0),
  });

  if (!affectedRows) {
    throw new ApiError(404, 'Jugador no encontrado');
  }

  return getPlayer(id);
}

async function remove(id) {
  const affectedRows = await deletePlayer(id);

  if (!affectedRows) {
    throw new ApiError(404, 'Jugador no encontrado');
  }

  return { deleted: true };
}

async function overview() {
  const totalMatches = await getTotalMatches();
  const aggregates = await getAggregates();
  const [topScorers, topPresences, topSanctions] = await Promise.all([
    findTopScorers(3),
    findMostPresences(3),
    findMostSanctions(3),
  ]);

  const normalizedTopScorers = topScorers.map((player) => normalizePlayer(player, totalMatches));
  const normalizedTopPresences = topPresences.map((player) => normalizePlayer(player, totalMatches));
  const normalizedTopSanctions = topSanctions.map((player) => normalizePlayer(player, totalMatches));

  return {
    ...aggregates,
    totalMatches,
    topScorer: normalizedTopScorers[0] || null,
    mostPresences: normalizedTopPresences[0] || null,
    mostSanctions: normalizedTopSanctions[0] || null,
    topScorers: normalizedTopScorers,
    topPresences: normalizedTopPresences,
    topSanctions: normalizedTopSanctions,
  };
}

module.exports = { listPlayers, getPlayer, create, update, remove, overview, normalizePlayer };

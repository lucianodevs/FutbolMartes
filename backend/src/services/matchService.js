const ApiError = require('../utils/ApiError');
const {
  findMatches,
  findMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  getMatchStats,
  getRecentMatches,
  getTopMvps,
} = require('../models/matchModel');
const { findPlayerById } = require('../models/playerModel');

function validateMatchInput(data) {
  const required = ['fecha', 'equipo_local', 'equipo_visitante', 'goles_local', 'goles_visitante'];
  for (const field of required) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw new ApiError(400, `El campo ${field} es obligatorio`);
    }
  }

  if (data.equipo_local === data.equipo_visitante) {
    throw new ApiError(400, 'El equipo local y visitante no pueden ser el mismo');
  }
}

function resolveWinner(data) {
  if (data.ganador) {
    return data.ganador;
  }

  const local = Number(data.goles_local);
  const visitor = Number(data.goles_visitante);
  if (local > visitor) {
    return data.equipo_local;
  }
  if (visitor > local) {
    return data.equipo_visitante;
  }
  return 'Empate';
}

async function list(query) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.max(Number(query.limit || 10), 1);
  const offset = (page - 1) * limit;
  const { rows, total } = await findMatches({
    team: query.team || '',
    result: query.result || '',
    search: query.search || '',
    limit,
    offset,
  });

  return {
    items: rows,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

async function get(id) {
  const match = await findMatchById(id);
  if (!match) {
    throw new ApiError(404, 'Partido no encontrado');
  }
  return match;
}

async function create(payload, userId) {
  validateMatchInput(payload);
  const mvpId = payload.mvp_jugador_id ? Number(payload.mvp_jugador_id) : null;
  if (mvpId) {
    const mvpPlayer = await findPlayerById(mvpId);
    if (!mvpPlayer) {
      throw new ApiError(400, 'El MVP seleccionado no existe');
    }
  }

  const ganador = resolveWinner(payload);
  const id = await createMatch({
    fecha: payload.fecha,
    equipo_local: payload.equipo_local,
    equipo_visitante: payload.equipo_visitante,
    goles_local: Number(payload.goles_local),
    goles_visitante: Number(payload.goles_visitante),
    ganador,
    observaciones: payload.observaciones,
    mvp_jugador_id: mvpId,
    created_by: userId,
  });
  return get(id);
}

async function update(id, payload) {
  validateMatchInput(payload);
  const mvpId = payload.mvp_jugador_id ? Number(payload.mvp_jugador_id) : null;
  if (mvpId) {
    const mvpPlayer = await findPlayerById(mvpId);
    if (!mvpPlayer) {
      throw new ApiError(400, 'El MVP seleccionado no existe');
    }
  }

  const ganador = resolveWinner(payload);
  const affectedRows = await updateMatch(id, {
    fecha: payload.fecha,
    equipo_local: payload.equipo_local,
    equipo_visitante: payload.equipo_visitante,
    goles_local: Number(payload.goles_local),
    goles_visitante: Number(payload.goles_visitante),
    ganador,
    observaciones: payload.observaciones,
    mvp_jugador_id: mvpId,
  });

  if (!affectedRows) {
    throw new ApiError(404, 'Partido no encontrado');
  }

  return get(id);
}

async function remove(id) {
  const affectedRows = await deleteMatch(id);
  if (!affectedRows) {
    throw new ApiError(404, 'Partido no encontrado');
  }
  return { deleted: true };
}

async function stats() {
  const [matchStats, recentMatches, topMvps] = await Promise.all([
    getMatchStats(),
    getRecentMatches(5),
    getTopMvps(3),
  ]);
  return { ...matchStats, recentMatches, topMvps };
}

module.exports = { list, get, create, update, remove, stats };

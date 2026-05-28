import api from './http';

export async function getPlayers(params) {
  const response = await api.get('/players', { params });
  return response.data.data;
}

export async function getPlayer(id) {
  const response = await api.get(`/players/${id}`);
  return response.data.data;
}

export async function createPlayer(payload) {
  const response = await api.post('/players', payload);
  return response.data.data;
}

export async function updatePlayer(id, payload) {
  const response = await api.put(`/players/${id}`, payload);
  return response.data.data;
}

export async function deletePlayer(id) {
  const response = await api.delete(`/players/${id}`);
  return response.data.data;
}

export async function getPlayerOverview() {
  const response = await api.get('/players/overview');
  return response.data.data;
}

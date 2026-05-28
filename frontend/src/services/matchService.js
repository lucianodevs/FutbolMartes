import api from './http';

export async function getMatches(params) {
  const response = await api.get('/matches', { params });
  return response.data.data;
}

export async function getMatch(id) {
  const response = await api.get(`/matches/${id}`);
  return response.data.data;
}

export async function createMatch(payload) {
  const response = await api.post('/matches', payload);
  return response.data.data;
}

export async function updateMatch(id, payload) {
  const response = await api.put(`/matches/${id}`, payload);
  return response.data.data;
}

export async function deleteMatch(id) {
  const response = await api.delete(`/matches/${id}`);
  return response.data.data;
}

export async function getMatchStats() {
  const response = await api.get('/matches/stats');
  return response.data.data;
}

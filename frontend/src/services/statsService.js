import api from './http';

export async function getOverviewStats() {
  const response = await api.get('/stats/overview');
  return response.data.data;
}

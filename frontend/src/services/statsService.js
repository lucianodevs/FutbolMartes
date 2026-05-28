import api from './http';

export async function getOverviewStats() {
  const response = await api.get('/stats/overview');
  return response.data.data;
}

export async function exportAllData() {
  const response = await api.get('/stats/export', { responseType: 'arraybuffer' });
  return response.data;
}

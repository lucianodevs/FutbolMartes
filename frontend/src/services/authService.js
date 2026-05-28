import api from './http';

export async function loginRequest(payload) {
  const response = await api.post('/auth/login', payload);
  return response.data.data;
}

export async function profileRequest() {
  const response = await api.get('/auth/profile');
  return response.data.data;
}

export async function registerRequest(payload) {
  const response = await api.post('/auth/register', payload);
  return response.data.data;
}

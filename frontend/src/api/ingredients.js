import api from './client';
export const getIngredients = (search = '') => api.get(`/ingredients${search ? `?search=${search}` : ''}`).then(r => r.data);
export const createIngredient = (data) => api.post('/ingredients', data).then(r => r.data);

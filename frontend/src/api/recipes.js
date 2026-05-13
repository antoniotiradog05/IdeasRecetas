import api from './client';
export const getRecipes = () => api.get('/recipes').then(r => r.data);
export const getRecipe = (id) => api.get(`/recipes/${id}`).then(r => r.data);
export const createRecipe = (data) => api.post('/recipes', data).then(r => r.data);
export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data).then(r => r.data);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`).then(r => r.data);

import api from './client';
export const getMealPlans = (start, end) => api.get(`/meal-plans?start=${start}&end=${end}`).then(r => r.data);
export const addMealPlan = (data) => api.post('/meal-plans', data).then(r => r.data);
export const removeMealPlan = (id) => api.delete(`/meal-plans/${id}`).then(r => r.data);
export const autoPlanWeek = (weekStart, weekEnd, mealTypes) =>
  api.post('/meal-plans/auto-plan', { weekStart, weekEnd, mealTypes }).then(r => r.data);


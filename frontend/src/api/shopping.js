import api from './client';
export const getShoppingList = (startDate, endDate) =>
  api.get(`/shopping-list?startDate=${startDate}&endDate=${endDate}`).then(r => r.data);

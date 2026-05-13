import { localStore } from '../data/store';

export const getIngredients = async () => {
  return localStore.getIngredients();
};

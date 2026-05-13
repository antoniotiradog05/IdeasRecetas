import { localStore } from '../data/store';

export const getIngredients = async () => {
  return localStore.getIngredients();
};

export const createIngredient = async (ingData) => {
  // In frontend-only, we just return it as if it was created
  // or we could add it to a local list of custom ingredients
  return { ...ingData, id: Date.now() };
};

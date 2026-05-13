import { localStore } from '../data/store';

export const getRecipes = async () => {
  return localStore.getRecipes();
};

export const createRecipe = async (recipeData) => {
  return localStore.saveRecipe(recipeData);
};

export const updateRecipe = async (id, recipeData) => {
  return localStore.saveRecipe({ ...recipeData, id });
};

export const deleteRecipe = async (id) => {
  return localStore.deleteRecipe(id);
};

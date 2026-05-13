import { initialIngredients } from './ingredients';
import { recipesExtra1 } from './recipes_extra1';
import { recipesExtra2 } from './recipes_extra2';
import { recipesExtra3 } from './recipes_extra3';

// Combine all initial recipes
const INITIAL_RECIPES = [
  ...recipesExtra1,
  ...recipesExtra2,
  ...recipesExtra3
].map((r, index) => ({ ...r, id: `init-${index}` }));

// Local Storage Keys
const KEYS = {
  RECIPES: 'smartcart_recipes',
  MEAL_PLANS: 'smartcart_meal_plans',
  INGREDIENTS: 'smartcart_ingredients'
};

// Initialize data if not present
const getStored = (key, initial) => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const localStore = {
  // RECIPES
  getRecipes: () => getStored(KEYS.RECIPES, INITIAL_RECIPES),
  saveRecipe: (recipe) => {
    const recipes = localStore.getRecipes();
    const newRecipe = { ...recipe, id: recipe.id || Date.now().toString() };
    const updated = recipe.id 
      ? recipes.map(r => r.id === recipe.id ? newRecipe : r)
      : [...recipes, newRecipe];
    localStorage.setItem(KEYS.RECIPES, JSON.stringify(updated));
    return newRecipe;
  },
  deleteRecipe: (id) => {
    const recipes = localStore.getRecipes().filter(r => r.id !== id);
    localStorage.setItem(KEYS.RECIPES, JSON.stringify(recipes));
  },

  // INGREDIENTS
  getIngredients: () => getStored(KEYS.INGREDIENTS, initialIngredients),

  // MEAL PLANS
  getMealPlans: (startDate, endDate) => {
    const all = getStored(KEYS.MEAL_PLANS, []);
    return all.filter(p => {
      const d = new Date(p.date);
      return d >= new Date(startDate) && d <= new Date(endDate);
    });
  },
  saveMealPlan: (plan) => {
    const all = getStored(KEYS.MEAL_PLANS, []);
    const newPlan = { ...plan, id: plan.id || Date.now().toString() };
    const updated = plan.id
      ? all.map(p => p.id === plan.id ? newPlan : p)
      : [...all, newPlan];
    localStorage.setItem(KEYS.MEAL_PLANS, JSON.stringify(updated));
    return newPlan;
  },
  deleteMealPlan: (id) => {
    const all = getStored(KEYS.MEAL_PLANS, []).filter(p => p.id !== id);
    localStorage.setItem(KEYS.MEAL_PLANS, JSON.stringify(all));
  },
  clearMealPlans: (startDate, endDate) => {
    const all = getStored(KEYS.MEAL_PLANS, []).filter(p => {
      const d = new Date(p.date);
      return !(d >= new Date(startDate) && d <= new Date(endDate));
    });
    localStorage.setItem(KEYS.MEAL_PLANS, JSON.stringify(all));
  }
};

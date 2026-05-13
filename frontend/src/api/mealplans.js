import { localStore } from '../data/store';

export const getMealPlans = async (startDate, endDate) => {
  return localStore.getMealPlans(startDate, endDate);
};

export const createMealPlan = async (planData) => {
  return localStore.saveMealPlan(planData);
};

export const removeMealPlan = async (id) => {
  return localStore.deleteMealPlan(id);
};

export const autoPlanWeek = async ({ startDate, endDate, meals }) => {
  const recipes = localStore.getRecipes();
  if (recipes.length === 0) return;

  // Shuffle recipes
  const shuffled = [...recipes].sort(() => Math.random() - 0.5);
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const selectedMeals = Object.entries(meals).filter(([_, v]) => v).map(([k]) => k);
  
  localStore.clearMealPlans(startDate, endDate);

  let recipeIdx = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    for (const mealType of selectedMeals) {
      const recipe = shuffled[recipeIdx % shuffled.length];
      localStore.saveMealPlan({
        date: d.toISOString().split('T')[0],
        mealType,
        recipeId: recipe.id,
        recipe: recipe // Include recipe object as expected by UI
      });
      recipeIdx++;
    }
  }
};

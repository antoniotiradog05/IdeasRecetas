import { localStore } from '../data/store';

export const getMealPlans = async (startDate, endDate) => {
  return localStore.getMealPlans(startDate, endDate);
};

export const addMealPlan = async (planData) => {
  return localStore.saveMealPlan(planData);
};

export const removeMealPlan = async (id) => {
  return localStore.deleteMealPlan(id);
};

export const autoPlanWeek = async ({ startDate, endDate, meals }) => {
  const recipes = localStore.getRecipes();
  if (recipes.length === 0) return;

  const shuffled = [...recipes].sort(() => Math.random() - 0.5);
  const selectedMeals = Object.entries(meals).filter(([_, v]) => v).map(([k]) => k);
  
  // Clear existing first
  localStore.clearMealPlans(startDate, endDate);

  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  let current = new Date(start);
  let recipeIdx = 0;

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    
    for (const mealType of selectedMeals) {
      const recipe = shuffled[recipeIdx % shuffled.length];
      localStore.saveMealPlan({
        date: dateStr,
        mealType,
        recipeId: recipe.id,
        recipe: recipe
      });
      recipeIdx++;
    }
    
    current.setDate(current.getDate() + 1);
  }
};

import { localStore } from '../data/store';

export const getShoppingList = async (startDate, endDate) => {
  const plans = localStore.getMealPlans(startDate, endDate);
  const ingredientsMap = {};

  plans.forEach(plan => {
    if (!plan.recipe || !plan.recipe.ingredients) return;
    
    plan.recipe.ingredients.forEach(ing => {
      // If it's the backend format, it might be { ingredient: {name, category}, quantity, unit }
      // If it's the local format (init data), it's { name, quantity, unit }
      const name = ing.name || (ing.ingredient && ing.ingredient.name);
      const category = ing.category || (ing.ingredient && ing.ingredient.category) || 'OTHER';
      const key = `${name}-${ing.unit}`;

      if (!ingredientsMap[key]) {
        ingredientsMap[key] = {
          name,
          category,
          quantity: 0,
          unit: ing.unit,
          checked: false
        };
      }
      ingredientsMap[key].quantity += ing.quantity;
    });
  });

  return Object.values(ingredientsMap);
};

const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();

const CATEGORY_ORDER = ['VEGETABLES', 'FRUITS', 'MEAT', 'FISH', 'DAIRY', 'GRAINS', 'CONDIMENTS', 'BEVERAGES', 'OTHER'];
const CATEGORY_LABELS = {
  VEGETABLES: '🥦 Verduras', FRUITS: '🍎 Frutas', MEAT: '🥩 Carnes',
  FISH: '🐟 Pescados', DAIRY: '🥛 Lácteos', GRAINS: '🌾 Cereales',
  CONDIMENTS: '🧂 Condimentos', BEVERAGES: '🥤 Bebidas', OTHER: '📦 Otros'
};

// GET /api/shopping-list?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const mealPlans = await prisma.mealPlan.findMany({
      where: { date: { gte: startDate, lte: endDate } },
      include: {
        recipe: {
          include: { ingredients: { include: { ingredient: true } } }
        }
      }
    });

    // 🧮 THE MAGIC ALGORITHM: Aggregate ingredients by id+unit, sum quantities
    const ingredientMap = {};
    for (const plan of mealPlans) {
      for (const ri of plan.recipe.ingredients) {
        const key = `${ri.ingredientId}::${ri.unit}`;
        if (!ingredientMap[key]) {
          ingredientMap[key] = {
            id: ri.ingredient.id,
            name: ri.ingredient.name,
            category: ri.ingredient.category,
            unit: ri.unit,
            totalQuantity: 0
          };
        }
        ingredientMap[key].totalQuantity += ri.quantity;
      }
    }

    // Group by category and sort
    const grouped = {};
    for (const item of Object.values(ingredientMap)) {
      const cat = item.category || 'OTHER';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }

    const categories = CATEGORY_ORDER
      .filter(cat => grouped[cat]?.length > 0)
      .map(cat => ({
        category: cat,
        label: CATEGORY_LABELS[cat] || cat,
        ingredients: grouped[cat].sort((a, b) => a.name.localeCompare(b.name))
      }));

    res.json({
      startDate, endDate,
      totalItems: Object.keys(ingredientMap).length,
      mealCount: mealPlans.length,
      categories
    });
  } catch (err) { next(err); }
});

module.exports = router;

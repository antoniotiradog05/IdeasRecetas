const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/meal-plans?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/', async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const where = {};
    if (start && end) {
      where.date = { gte: start, lte: end };
    }
    const plans = await prisma.mealPlan.findMany({
      where,
      include: {
        recipe: { include: { ingredients: { include: { ingredient: true } } } }
      },
      orderBy: [{ date: 'asc' }]
    });
    res.json(plans);
  } catch (err) { next(err); }
});

// POST /api/meal-plans
router.post('/', async (req, res, next) => {
  try {
    const { recipeId, date, mealType } = req.body;

    // Remove existing plan for same slot
    await prisma.mealPlan.deleteMany({ where: { date, mealType } });

    const plan = await prisma.mealPlan.create({
      data: { recipeId: Number(recipeId), date, mealType },
      include: {
        recipe: { include: { ingredients: { include: { ingredient: true } } } }
      }
    });
    res.status(201).json(plan);
  } catch (err) { next(err); }
});

// POST /api/meal-plans/auto-plan  ← Must be BEFORE /:id
router.post('/auto-plan', async (req, res, next) => {
  try {
    const { weekStart, weekEnd, mealTypes = ['LUNCH', 'DINNER'] } = req.body;

    // Get all recipes
    const recipes = await prisma.recipe.findMany();
    if (recipes.length === 0) {
      return res.status(400).json({ error: 'No hay recetas disponibles. Crea al menos una receta primero.' });
    }

    // Build list of days between weekStart and weekEnd
    const dates = [];
    const cur = new Date(weekStart);
    const end = new Date(weekEnd);
    while (cur <= end) {
      dates.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }

    // Delete ALL existing plans for the week
    await prisma.mealPlan.deleteMany({
      where: { date: { gte: weekStart, lte: weekEnd } }
    });

    // Fisher-Yates shuffle for true randomness
    const shuffled = [...recipes].sort(() => Math.random() - 0.5);

    // Build all slots and assign recipes avoiding consecutive repeats
    const slots = [];
    for (const date of dates) {
      for (const mealType of mealTypes) {
        slots.push({ date, mealType });
      }
    }

    // Distribute recipes: cycle through shuffle, re-shuffle when we run out
    let pool = [...shuffled];
    const plans = [];
    for (const slot of slots) {
      if (pool.length === 0) pool = [...shuffled].sort(() => Math.random() - 0.5);
      const recipe = pool.shift();
      plans.push({ recipeId: recipe.id, date: slot.date, mealType: slot.mealType });
    }

    // Save to DB
    await prisma.mealPlan.createMany({ data: plans });

    // Fetch with full recipe data to return to client
    const saved = await prisma.mealPlan.findMany({
      where: { date: { gte: weekStart, lte: weekEnd } },
      include: {
        recipe: { include: { ingredients: { include: { ingredient: true } } } }
      }
    });

    res.json({
      message: `✅ Semana planificada con ${saved.length} comidas`,
      plans: saved
    });
  } catch (err) { next(err); }
});

// DELETE /api/meal-plans/:id

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.mealPlan.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;

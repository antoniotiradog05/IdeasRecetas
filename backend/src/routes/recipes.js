const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/recipes
router.get('/', async (req, res, next) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: { include: { ingredient: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(recipes);
  } catch (err) { next(err); }
});

// GET /api/recipes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(req.params.id) },
      include: { ingredients: { include: { ingredient: true } } }
    });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) { next(err); }
});

// POST /api/recipes
router.post('/', async (req, res, next) => {
  try {
    const { name, description, prepTime, servings, ingredients } = req.body;
    const recipe = await prisma.recipe.create({
      data: {
        name, description,
        prepTime: prepTime ? Number(prepTime) : null,
        servings: servings ? Number(servings) : 2,
        ingredients: {
          create: (ingredients || []).map(i => ({
            ingredientId: Number(i.ingredientId),
            quantity: Number(i.quantity),
            unit: i.unit
          }))
        }
      },
      include: { ingredients: { include: { ingredient: true } } }
    });
    res.status(201).json(recipe);
  } catch (err) { next(err); }
});

// PUT /api/recipes/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, prepTime, servings, ingredients } = req.body;
    const id = Number(req.params.id);

    // Delete old ingredients and recreate
    await prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        name, description,
        prepTime: prepTime ? Number(prepTime) : null,
        servings: servings ? Number(servings) : 2,
        ingredients: {
          create: (ingredients || []).map(i => ({
            ingredientId: Number(i.ingredientId),
            quantity: Number(i.quantity),
            unit: i.unit
          }))
        }
      },
      include: { ingredients: { include: { ingredient: true } } }
    });
    res.json(recipe);
  } catch (err) { next(err); }
});

// DELETE /api/recipes/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.recipe.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;

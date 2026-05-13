const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/ingredients?search=
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    const ingredients = await prisma.ingredient.findMany({
      where: search ? { name: { contains: search } } : undefined,
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
    res.json(ingredients);
  } catch (err) { next(err); }
});

// POST /api/ingredients
router.post('/', async (req, res, next) => {
  try {
    const { name, category, baseUnit } = req.body;
    const ingredient = await prisma.ingredient.create({
      data: { name, category, baseUnit }
    });
    res.status(201).json(ingredient);
  } catch (err) { next(err); }
});

// DELETE /api/ingredients/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.ingredient.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ingredients = [
  // Verduras
  { name: 'Cebolla', category: 'VEGETABLES', baseUnit: 'Unidad' },
  { name: 'Tomate', category: 'VEGETABLES', baseUnit: 'Gramos' },
  { name: 'Ajo', category: 'VEGETABLES', baseUnit: 'Diente' },
  { name: 'Pimiento rojo', category: 'VEGETABLES', baseUnit: 'Unidad' },
  { name: 'Pimiento verde', category: 'VEGETABLES', baseUnit: 'Unidad' },
  { name: 'Zanahoria', category: 'VEGETABLES', baseUnit: 'Unidad' },
  { name: 'Patata', category: 'VEGETABLES', baseUnit: 'Gramos' },
  { name: 'Calabacín', category: 'VEGETABLES', baseUnit: 'Unidad' },
  { name: 'Berenjena', category: 'VEGETABLES', baseUnit: 'Unidad' },
  { name: 'Espinacas', category: 'VEGETABLES', baseUnit: 'Gramos' },
  { name: 'Lechuga', category: 'VEGETABLES', baseUnit: 'Unidad' },
  { name: 'Pepino', category: 'VEGETABLES', baseUnit: 'Unidad' },
  { name: 'Puerro', category: 'VEGETABLES', baseUnit: 'Unidad' },
  { name: 'Brócoli', category: 'VEGETABLES', baseUnit: 'Gramos' },
  { name: 'Champiñones', category: 'VEGETABLES', baseUnit: 'Gramos' },
  { name: 'Lentejas', category: 'VEGETABLES', baseUnit: 'Gramos' },
  { name: 'Garbanzos', category: 'VEGETABLES', baseUnit: 'Gramos' },
  { name: 'Judías verdes', category: 'VEGETABLES', baseUnit: 'Gramos' },
  { name: 'Acelgas', category: 'VEGETABLES', baseUnit: 'Gramos' },
  { name: 'Espárragos', category: 'VEGETABLES', baseUnit: 'Unidad' },
  // Frutas
  { name: 'Limón', category: 'FRUITS', baseUnit: 'Unidad' },
  { name: 'Naranja', category: 'FRUITS', baseUnit: 'Unidad' },
  { name: 'Manzana', category: 'FRUITS', baseUnit: 'Unidad' },
  { name: 'Aguacate', category: 'FRUITS', baseUnit: 'Unidad' },
  { name: 'Plátano', category: 'FRUITS', baseUnit: 'Unidad' },
  // Carnes
  { name: 'Pechuga de pollo', category: 'MEAT', baseUnit: 'Gramos' },
  { name: 'Muslos de pollo', category: 'MEAT', baseUnit: 'Unidad' },
  { name: 'Carne picada', category: 'MEAT', baseUnit: 'Gramos' },
  { name: 'Filete de ternera', category: 'MEAT', baseUnit: 'Gramos' },
  { name: 'Lomo de cerdo', category: 'MEAT', baseUnit: 'Gramos' },
  { name: 'Bacon', category: 'MEAT', baseUnit: 'Gramos' },
  { name: 'Chorizo', category: 'MEAT', baseUnit: 'Gramos' },
  // Pescados
  { name: 'Salmón', category: 'FISH', baseUnit: 'Gramos' },
  { name: 'Merluza', category: 'FISH', baseUnit: 'Gramos' },
  { name: 'Atún en lata', category: 'FISH', baseUnit: 'Lata' },
  { name: 'Gambas', category: 'FISH', baseUnit: 'Gramos' },
  { name: 'Mejillones', category: 'FISH', baseUnit: 'Gramos' },
  { name: 'Bacalao', category: 'FISH', baseUnit: 'Gramos' },
  // Lácteos
  { name: 'Huevo', category: 'DAIRY', baseUnit: 'Unidad' },
  { name: 'Leche', category: 'DAIRY', baseUnit: 'ml' },
  { name: 'Queso rallado', category: 'DAIRY', baseUnit: 'Gramos' },
  { name: 'Mozzarella', category: 'DAIRY', baseUnit: 'Gramos' },
  { name: 'Mantequilla', category: 'DAIRY', baseUnit: 'Gramos' },
  { name: 'Nata para cocinar', category: 'DAIRY', baseUnit: 'ml' },
  { name: 'Yogur natural', category: 'DAIRY', baseUnit: 'Unidad' },
  // Cereales
  { name: 'Arroz', category: 'GRAINS', baseUnit: 'Gramos' },
  { name: 'Pasta', category: 'GRAINS', baseUnit: 'Gramos' },
  { name: 'Pan', category: 'GRAINS', baseUnit: 'Rebanada' },
  { name: 'Harina', category: 'GRAINS', baseUnit: 'Gramos' },
  { name: 'Quinoa', category: 'GRAINS', baseUnit: 'Gramos' },
  { name: 'Avena', category: 'GRAINS', baseUnit: 'Gramos' },
  // Condimentos
  { name: 'Aceite de oliva', category: 'CONDIMENTS', baseUnit: 'ml' },
  { name: 'Sal', category: 'CONDIMENTS', baseUnit: 'Cucharadita' },
  { name: 'Pimienta negra', category: 'CONDIMENTS', baseUnit: 'Cucharadita' },
  { name: 'Orégano', category: 'CONDIMENTS', baseUnit: 'Cucharadita' },
  { name: 'Pimentón dulce', category: 'CONDIMENTS', baseUnit: 'Cucharadita' },
  { name: 'Comino', category: 'CONDIMENTS', baseUnit: 'Cucharadita' },
  { name: 'Vinagre', category: 'CONDIMENTS', baseUnit: 'ml' },
  { name: 'Salsa de soja', category: 'CONDIMENTS', baseUnit: 'ml' },
  { name: 'Tomate frito', category: 'CONDIMENTS', baseUnit: 'Gramos' },
  // Bebidas
  { name: 'Caldo de pollo', category: 'BEVERAGES', baseUnit: 'ml' },
  { name: 'Caldo de verduras', category: 'BEVERAGES', baseUnit: 'ml' },
  { name: 'Vino blanco', category: 'BEVERAGES', baseUnit: 'ml' },
];

// 22 recetas españolas completas con ingredientes
const RECIPES_TEMPLATE = [
  {
    name: 'Tortilla española',
    description: 'El clásico de la cocina española. Huevo, patata y cebolla pochada.',
    prepTime: 35, servings: 4,
    ingredients: [
      { name: 'Patata', quantity: 500, unit: 'Gramos' },
      { name: 'Huevo', quantity: 4, unit: 'Unidad' },
      { name: 'Cebolla', quantity: 1, unit: 'Unidad' },
      { name: 'Aceite de oliva', quantity: 100, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Pasta boloñesa',
    description: 'Clásica pasta con salsa de carne picada y tomate.',
    prepTime: 40, servings: 4,
    ingredients: [
      { name: 'Pasta', quantity: 400, unit: 'Gramos' },
      { name: 'Carne picada', quantity: 300, unit: 'Gramos' },
      { name: 'Tomate frito', quantity: 400, unit: 'Gramos' },
      { name: 'Cebolla', quantity: 1, unit: 'Unidad' },
      { name: 'Ajo', quantity: 2, unit: 'Diente' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
      { name: 'Orégano', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Salmón al horno con limón',
    description: 'Salmón jugoso al horno con ajo, limón y hierbas. Listo en 20 minutos.',
    prepTime: 25, servings: 2,
    ingredients: [
      { name: 'Salmón', quantity: 400, unit: 'Gramos' },
      { name: 'Limón', quantity: 1, unit: 'Unidad' },
      { name: 'Ajo', quantity: 2, unit: 'Diente' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
      { name: 'Pimienta negra', quantity: 0.5, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Pollo asado con patatas',
    description: 'Muslos de pollo jugosos con patatas al horno y pimentón. El domingo de siempre.',
    prepTime: 60, servings: 4,
    ingredients: [
      { name: 'Muslos de pollo', quantity: 6, unit: 'Unidad' },
      { name: 'Patata', quantity: 600, unit: 'Gramos' },
      { name: 'Ajo', quantity: 4, unit: 'Diente' },
      { name: 'Aceite de oliva', quantity: 50, unit: 'ml' },
      { name: 'Pimentón dulce', quantity: 1, unit: 'Cucharadita' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Lentejas con chorizo',
    description: 'Potaje reconfortante de lentejas con verduras y chorizo. Ideal para el invierno.',
    prepTime: 45, servings: 4,
    ingredients: [
      { name: 'Lentejas', quantity: 350, unit: 'Gramos' },
      { name: 'Chorizo', quantity: 150, unit: 'Gramos' },
      { name: 'Zanahoria', quantity: 2, unit: 'Unidad' },
      { name: 'Cebolla', quantity: 1, unit: 'Unidad' },
      { name: 'Pimiento verde', quantity: 1, unit: 'Unidad' },
      { name: 'Ajo', quantity: 2, unit: 'Diente' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
      { name: 'Pimentón dulce', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Arroz con pollo',
    description: 'Arroz meloso con pollo, pimiento y caldo casero. Un plato que gusta a todos.',
    prepTime: 45, servings: 4,
    ingredients: [
      { name: 'Arroz', quantity: 320, unit: 'Gramos' },
      { name: 'Pechuga de pollo', quantity: 400, unit: 'Gramos' },
      { name: 'Pimiento rojo', quantity: 1, unit: 'Unidad' },
      { name: 'Cebolla', quantity: 1, unit: 'Unidad' },
      { name: 'Caldo de pollo', quantity: 800, unit: 'ml' },
      { name: 'Aceite de oliva', quantity: 40, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Merluza a la plancha',
    description: 'Merluza con ajo y perejil. Sano, rápido y delicioso.',
    prepTime: 15, servings: 2,
    ingredients: [
      { name: 'Merluza', quantity: 400, unit: 'Gramos' },
      { name: 'Ajo', quantity: 3, unit: 'Diente' },
      { name: 'Limón', quantity: 1, unit: 'Unidad' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Espaguetis con gambas al ajillo',
    description: 'Pasta con gambas salteadas en aceite de ajo. Listo en 20 minutos.',
    prepTime: 20, servings: 2,
    ingredients: [
      { name: 'Pasta', quantity: 200, unit: 'Gramos' },
      { name: 'Gambas', quantity: 250, unit: 'Gramos' },
      { name: 'Ajo', quantity: 4, unit: 'Diente' },
      { name: 'Aceite de oliva', quantity: 50, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
      { name: 'Pimienta negra', quantity: 0.5, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Crema de calabacín',
    description: 'Crema suave y reconfortante de calabacín. Perfecta como primero.',
    prepTime: 30, servings: 4,
    ingredients: [
      { name: 'Calabacín', quantity: 3, unit: 'Unidad' },
      { name: 'Cebolla', quantity: 1, unit: 'Unidad' },
      { name: 'Nata para cocinar', quantity: 100, unit: 'ml' },
      { name: 'Caldo de verduras', quantity: 500, unit: 'ml' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Revuelto de champiñones',
    description: 'Huevos revueltos con champiñones y ajo. El almuerzo rápido perfecto.',
    prepTime: 15, servings: 2,
    ingredients: [
      { name: 'Huevo', quantity: 4, unit: 'Unidad' },
      { name: 'Champiñones', quantity: 250, unit: 'Gramos' },
      { name: 'Ajo', quantity: 2, unit: 'Diente' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Ensalada de atún',
    description: 'Ensalada fresca con atún, tomate, lechuga y huevo cocido.',
    prepTime: 10, servings: 2,
    ingredients: [
      { name: 'Lechuga', quantity: 1, unit: 'Unidad' },
      { name: 'Atún en lata', quantity: 2, unit: 'Lata' },
      { name: 'Tomate', quantity: 200, unit: 'Gramos' },
      { name: 'Huevo', quantity: 2, unit: 'Unidad' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
      { name: 'Vinagre', quantity: 15, unit: 'ml' },
      { name: 'Sal', quantity: 0.5, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Pisto manchego',
    description: 'Guiso de verduras mediterráneas con tomate. Perfecto solo o como guarnición.',
    prepTime: 35, servings: 4,
    ingredients: [
      { name: 'Calabacín', quantity: 2, unit: 'Unidad' },
      { name: 'Pimiento rojo', quantity: 1, unit: 'Unidad' },
      { name: 'Pimiento verde', quantity: 1, unit: 'Unidad' },
      { name: 'Tomate', quantity: 300, unit: 'Gramos' },
      { name: 'Cebolla', quantity: 1, unit: 'Unidad' },
      { name: 'Aceite de oliva', quantity: 50, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Carne con patatas al horno',
    description: 'Filetes de ternera jugosos con patatas y cebolla al horno.',
    prepTime: 55, servings: 4,
    ingredients: [
      { name: 'Filete de ternera', quantity: 500, unit: 'Gramos' },
      { name: 'Patata', quantity: 600, unit: 'Gramos' },
      { name: 'Cebolla', quantity: 2, unit: 'Unidad' },
      { name: 'Ajo', quantity: 3, unit: 'Diente' },
      { name: 'Aceite de oliva', quantity: 50, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Sopa de fideos',
    description: 'La sopa casera de siempre. Caldo con fideos y zanahoria.',
    prepTime: 20, servings: 4,
    ingredients: [
      { name: 'Pasta', quantity: 150, unit: 'Gramos' },
      { name: 'Caldo de pollo', quantity: 1200, unit: 'ml' },
      { name: 'Zanahoria', quantity: 2, unit: 'Unidad' },
      { name: 'Sal', quantity: 0.5, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Garbanzos con espinacas',
    description: 'Potaje clásico andaluz. Garbanzos cremosos con espinacas y comino.',
    prepTime: 30, servings: 4,
    ingredients: [
      { name: 'Garbanzos', quantity: 400, unit: 'Gramos' },
      { name: 'Espinacas', quantity: 200, unit: 'Gramos' },
      { name: 'Tomate frito', quantity: 200, unit: 'Gramos' },
      { name: 'Cebolla', quantity: 1, unit: 'Unidad' },
      { name: 'Ajo', quantity: 2, unit: 'Diente' },
      { name: 'Comino', quantity: 1, unit: 'Cucharadita' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
    ]
  },
  {
    name: 'Macarrones gratinados',
    description: 'Macarrones con carne picada y tomate, gratinados con queso.',
    prepTime: 40, servings: 4,
    ingredients: [
      { name: 'Pasta', quantity: 350, unit: 'Gramos' },
      { name: 'Carne picada', quantity: 250, unit: 'Gramos' },
      { name: 'Tomate frito', quantity: 300, unit: 'Gramos' },
      { name: 'Queso rallado', quantity: 100, unit: 'Gramos' },
      { name: 'Cebolla', quantity: 1, unit: 'Unidad' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
    ]
  },
  {
    name: 'Pollo a la plancha con brócoli',
    description: 'Pechuga de pollo a la plancha con brócoli al vapor. Sano y equilibrado.',
    prepTime: 20, servings: 2,
    ingredients: [
      { name: 'Pechuga de pollo', quantity: 350, unit: 'Gramos' },
      { name: 'Brócoli', quantity: 300, unit: 'Gramos' },
      { name: 'Limón', quantity: 1, unit: 'Unidad' },
      { name: 'Aceite de oliva', quantity: 25, unit: 'ml' },
      { name: 'Sal', quantity: 0.5, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Judías verdes con patatas',
    description: 'Guiso tradicional de judías verdes, patatas y zanahoria.',
    prepTime: 30, servings: 4,
    ingredients: [
      { name: 'Judías verdes', quantity: 400, unit: 'Gramos' },
      { name: 'Patata', quantity: 300, unit: 'Gramos' },
      { name: 'Zanahoria', quantity: 2, unit: 'Unidad' },
      { name: 'Ajo', quantity: 2, unit: 'Diente' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Bacalao con tomate',
    description: 'Bacalao en salsa de tomate con pimiento y ajo. Plato casero de toda la vida.',
    prepTime: 35, servings: 4,
    ingredients: [
      { name: 'Bacalao', quantity: 500, unit: 'Gramos' },
      { name: 'Tomate frito', quantity: 400, unit: 'Gramos' },
      { name: 'Pimiento rojo', quantity: 1, unit: 'Unidad' },
      { name: 'Cebolla', quantity: 1, unit: 'Unidad' },
      { name: 'Ajo', quantity: 3, unit: 'Diente' },
      { name: 'Aceite de oliva', quantity: 40, unit: 'ml' },
    ]
  },
  {
    name: 'Lomo de cerdo con champiñones',
    description: 'Lomo salteado con champiñones en salsa. Fácil y muy sabroso.',
    prepTime: 30, servings: 4,
    ingredients: [
      { name: 'Lomo de cerdo', quantity: 500, unit: 'Gramos' },
      { name: 'Champiñones', quantity: 300, unit: 'Gramos' },
      { name: 'Cebolla', quantity: 1, unit: 'Unidad' },
      { name: 'Nata para cocinar', quantity: 150, unit: 'ml' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
    ]
  },
  {
    name: 'Ensalada con aguacate y atún',
    description: 'Ensalada fresca con aguacate cremoso, atún y tomate.',
    prepTime: 10, servings: 2,
    ingredients: [
      { name: 'Aguacate', quantity: 1, unit: 'Unidad' },
      { name: 'Atún en lata', quantity: 2, unit: 'Lata' },
      { name: 'Lechuga', quantity: 1, unit: 'Unidad' },
      { name: 'Tomate', quantity: 200, unit: 'Gramos' },
      { name: 'Limón', quantity: 1, unit: 'Unidad' },
      { name: 'Aceite de oliva', quantity: 20, unit: 'ml' },
    ]
  },
  {
    name: 'Arroz con verduras',
    description: 'Arroz salteado con pimientos, zanahoria y champiñones. Ligero y nutritivo.',
    prepTime: 30, servings: 4,
    ingredients: [
      { name: 'Arroz', quantity: 300, unit: 'Gramos' },
      { name: 'Pimiento rojo', quantity: 1, unit: 'Unidad' },
      { name: 'Zanahoria', quantity: 2, unit: 'Unidad' },
      { name: 'Champiñones', quantity: 200, unit: 'Gramos' },
      { name: 'Caldo de verduras', quantity: 600, unit: 'ml' },
      { name: 'Aceite de oliva', quantity: 30, unit: 'ml' },
      { name: 'Sal', quantity: 1, unit: 'Cucharadita' },
    ]
  },
];

const recipesExtra1 = require('./recipes_extra1');
const recipesExtra2 = require('./recipes_extra2');
const recipesExtra3 = require('./recipes_extra3');

const ALL_TEMPLATES = [...RECIPES_TEMPLATE, ...recipesExtra1, ...recipesExtra2, ...recipesExtra3];

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Upsert ingredients
  for (const ing of ingredients) {
    await prisma.ingredient.upsert({
      where: { name: ing.name },
      update: {},
      create: ing
    });
  }
  console.log(`✅ ${ingredients.length} ingredientes sembrados`);

  // 2. Seed recipes (skip if already exist by name)
  let recipesCreated = 0;
  for (const tmpl of ALL_TEMPLATES) {
    const exists = await prisma.recipe.findFirst({ where: { name: tmpl.name } });
    if (exists) continue;

    // Resolve ingredient IDs
    const ingredientLinks = [];
    for (const ing of tmpl.ingredients) {
      const found = await prisma.ingredient.findUnique({ where: { name: ing.name } });
      if (found) {
        ingredientLinks.push({ ingredientId: found.id, quantity: ing.quantity, unit: ing.unit });
      } else {
        // Fallback for missing ingredients - create them on the fly
        const newIng = await prisma.ingredient.create({
          data: { name: ing.name, category: 'OTHER', baseUnit: ing.unit }
        });
        ingredientLinks.push({ ingredientId: newIng.id, quantity: ing.quantity, unit: ing.unit });
      }
    }

    await prisma.recipe.create({
      data: {
        name: tmpl.name,
        description: tmpl.description,
        prepTime: tmpl.prepTime,
        servings: tmpl.servings,
        ingredients: { create: ingredientLinks }
      }
    });
    recipesCreated++;
  }
  console.log(`✅ ${recipesCreated} recetas nuevas sembradas (${ALL_TEMPLATES.length - recipesCreated} ya existían)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

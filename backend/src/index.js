const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/meal-plans', require('./routes/mealplans'));
app.use('/api/shopping-list', require('./routes/shopping'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'SmartCart API running' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🛒 SmartCart API running on http://localhost:${PORT}\n`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestichat',
  logging: false
});

// Models
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'users',
  timestamps: false
});

const Cat = sequelize.define('Cat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'cats',
  timestamps: false
});

const Meal = sequelize.define('Meal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cat_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fed_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  sachets_used: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'meals',
  timestamps: false
});

const Stock = sequelize.define('Stock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sachets_added: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'stock',
  timestamps: false
});

// Relationships
User.hasMany(Meal, { foreignKey: 'user_id' });
Meal.belongsTo(User, { foreignKey: 'user_id' });

Cat.hasMany(Meal, { foreignKey: 'cat_id' });
Meal.belongsTo(Cat, { foreignKey: 'cat_id' });

User.hasMany(Stock, { foreignKey: 'user_id' });
Stock.belongsTo(User, { foreignKey: 'user_id' });

// Helper function to format date in French
function formatDateToFrench(date) {
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  
  const d = new Date(date);
  const dayName = days[d.getDay()];
  const day = String(d.getDate()).padStart(2, '0');
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${dayName} ${day} ${monthName} ${year}, ${hours}:${minutes}`;
}

// API Routes

// Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({ order: ['name'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const user = await User.create({ name });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (name) user.name = name;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cats
app.get('/api/cats', async (req, res) => {
  try {
    const cats = await Cat.findAll({ order: ['name'] });
    res.json(cats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cats', async (req, res) => {
  try {
    const { name, active = true } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const cat = await Cat.create({ name, active });
    res.status(201).json(cat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/cats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, active } = req.body;
    const cat = await Cat.findByPk(id);
    if (!cat) {
      return res.status(404).json({ error: 'Cat not found' });
    }
    if (name) cat.name = name;
    if (active !== undefined) cat.active = active;
    await cat.save();
    res.json(cat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Cat.findByPk(id);
    if (!cat) {
      return res.status(404).json({ error: 'Cat not found' });
    }
    await cat.destroy();
    res.json({ message: 'Cat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Meals
app.get('/api/meals', async (req, res) => {
  try {
    const { limit, catId, userId } = req.query;
    const where = {};
    if (catId) where.cat_id = catId;
    if (userId) where.user_id = userId;
    
    const options = {
      where,
      include: [
        { model: Cat, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'name'] }
      ],
      order: [['fed_at', 'DESC']]
    };
    
    if (limit) options.limit = parseInt(limit);
    
    const meals = await Meal.findAll(options);
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/meals', async (req, res) => {
  try {
    const { cat_id, user_id, fed_at, sachets_used = 1 } = req.body;
    if (!cat_id || !user_id) {
      return res.status(400).json({ error: 'cat_id and user_id are required' });
    }
    const meal = await Meal.create({ cat_id, user_id, fed_at: fed_at || new Date(), sachets_used });
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/meals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findByPk(id);
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    await meal.destroy();
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cat meals
app.get('/api/cats/:id/meals', async (req, res) => {
  try {
    const { id } = req.params;
    const meals = await Meal.findAll({
      where: { cat_id: id },
      include: [
        { model: Cat, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'name'] }
      ],
      order: [['fed_at', 'DESC']]
    });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stock
app.get('/api/stock/current', async (req, res) => {
  try {
    const stockAdded = await Stock.sum('sachets_added');
    const stockUsed = await Meal.sum('sachets_used');
    const currentStock = (stockAdded || 0) - (stockUsed || 0);
    res.json({ currentStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stock/history', async (req, res) => {
  try {
    const stockHistory = await Stock.findAll({
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['added_at', 'DESC']]
    });
    res.json(stockHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stock', async (req, res) => {
  try {
    const { sachets_added, user_id, note } = req.body;
    if (!sachets_added || !user_id) {
      return res.status(400).json({ error: 'sachets_added and user_id are required' });
    }
    const stock = await Stock.create({ sachets_added, user_id, note, added_at: new Date() });
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard endpoints
app.get('/api/dashboard/latest-meals-by-cat', async (req, res) => {
  try {
    const activeCats = await Cat.findAll({ where: { active: true }, order: ['name'] });
    const result = [];
    
    for (const cat of activeCats) {
      const latestMeal = await Meal.findOne({
        where: { cat_id: cat.id },
        include: [
          { model: User, attributes: ['id', 'name'] }
        ],
        order: [['fed_at', 'DESC']]
      });
      
      result.push({
        cat: cat,
        latestMeal: latestMeal ? {
          ...latestMeal.toJSON(),
          fed_at_formatted: formatDateToFrench(latestMeal.fed_at),
          isRecent: latestMeal.fed_at > new Date(Date.now() - 6 * 60 * 60 * 1000)
        } : null
      });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/recent-meals', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const meals = await Meal.findAll({
      include: [
        { model: Cat, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'name'] }
      ],
      order: [['fed_at', 'DESC']],
      limit: parseInt(limit)
    });
    
    const formattedMeals = meals.map(meal => ({
      ...meal.toJSON(),
      fed_at_formatted: formatDateToFrench(meal.fed_at)
    }));
    
    res.json(formattedMeals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Models synchronized.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();

module.exports = { app, sequelize, User, Cat, Meal, Stock, formatDateToFrench };

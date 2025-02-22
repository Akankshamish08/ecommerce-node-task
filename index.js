const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const User = require('./models/userModel');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const swaggerDocs = require('./config/swaggerConfig');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

sequelize.sync({ alter: true }) // Syncs database
    .then(() => console.log('Database synchronized'))
    .catch((err) => console.error('Error syncing database:', err));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

swaggerDocs(app);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS konfiguracija
const allowedOrigins = [
  'https://timb-mongodb-logistika-i-lanac-opskrbe.onrender.com',
  'http://localhost:5173' // Za lokalno testiranje
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// MongoDB veza
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✓ Connected to MongoDB');
      console.log('✓ Database name:', mongoose.connection.name);
    })
    .catch(err => {
      console.error('✗ MongoDB connection error:', err);
      process.exit(1); // Prekini aplikaciju ako nema veze s bazom
    });
} else {
  console.error('✗ MONGODB_URI nije postavljen u .env');
  process.exit(1); // Prekini aplikaciju ako nije postavljen MONGODB_URI
}

// Glavna ruta
app.get('/', (req, res) => {
  res.json({
    message: 'API za upravljanje logistikom i lancem opskrbe',
    endpoints: {
      proizvodi: '/api/proizvodi',
      dobavljaci: '/api/dobavljaci',
      posiljke: '/api/posiljke',
      skladista: '/api/skladista'
    }
  });
});

// Import ruta
const proizvodiRoutes = require('./routes/proizvodi');
const dobavljaciRoutes = require('./routes/dobavljaci');
const posiljkeRoutes = require('./routes/posiljke');
const skladistaRoutes = require('./routes/skladista');

// Povezivanje ruta
app.use('/api/proizvodi', proizvodiRoutes);
app.use('/api/dobavljaci', dobavljaciRoutes);
app.use('/api/posiljke', posiljkeRoutes);
app.use('/api/skladista', skladistaRoutes);

// Globalni error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Pokretanje servera
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Available at: https://logistika-mlr5.onrender.com`);
  console.log(`✓ API endpoints:`);
  console.log(`  - /api/proizvodi`);
  console.log(`  - /api/dobavljaci`);
  console.log(`  - /api/posiljke`);
  console.log(`  - /api/skladista`);
});
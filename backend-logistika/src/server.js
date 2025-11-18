require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✓ Connected to MongoDB');
      console.log('✓ Ime baze:', mongoose.connection.name);
    })
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('MONGODB_URI nije postavljen u .env');
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

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API endpoints:`);
  console.log(`  - http://localhost:${PORT}/api/proizvodi`);
  console.log(`  - http://localhost:${PORT}/api/dobavljaci`);
  console.log(`  - http://localhost:${PORT}/api/posiljke`);
  console.log(`  - http://localhost:${PORT}/api/skladista`);
});
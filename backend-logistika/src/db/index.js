const mongoose = require('mongoose');
const connectDB = async () => {
 try {
 await mongoose.connect(process.env.MONGODB_URI);
 console.log('MongoDB connected successfully');
 } catch (err) {
 console.error('MongoDB connection error:', err);
 process.exit(1); // izlaz iz aplikacije u slučaju greške
 }
};
module.exports = connectDB;
// U src/server.js potrebno je povezati bazu:
require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware za parsiranje JSON-a
app.use(express.json());
// Povezivanje na MongoDB
connectDB();
// Jednostavna test ruta
app.get('/', (req, res) => res.send('Hello from Express + MongoDB!'));
// Pokretanje servera
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
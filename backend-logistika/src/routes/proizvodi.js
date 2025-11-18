const express = require('express');
const router = express.Router();
const Proizvod = require('../models/Proizvod');

// ==========================================
// CREATE - Dodavanje novog proizvoda
// POST /api/proizvodi
// ==========================================
router.post('/', async (req, res) => {
  try {
    const proizvod = new Proizvod(req.body);
    await proizvod.save();
    res.status(201).json({
      message: 'Proizvod uspješno dodan',
      proizvod: proizvod
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Greška pri dodavanju proizvoda', 
      error: err.message 
    });
  }
});

// ==========================================
// READ - Dohvat svih proizvoda
// GET /api/proizvodi
// ==========================================
router.get('/', async (req, res) => {
  try {
    const proizvodi = await Proizvod.find();
    res.json({
      count: proizvodi.length,
      proizvodi: proizvodi
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri dohvaćanju proizvoda', 
      error: err.message 
    });
  }
});

// ==========================================
// READ - Dohvat jednog proizvoda po ID-u
// GET /api/proizvodi/:id
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const proizvod = await Proizvod.findById(req.params.id);
    
    if (!proizvod) {
      return res.status(404).json({ 
        message: 'Proizvod nije pronađen' 
      });
    }
    
    res.json(proizvod);
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri dohvaćanju proizvoda', 
      error: err.message 
    });
  }
});

// ==========================================
// UPDATE - Ažuriranje proizvoda po ID-u
// PUT /api/proizvodi/:id
// ==========================================
router.put('/:id', async (req, res) => {
  try {
    const proizvod = await Proizvod.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true,           // Vraća ažurirani dokument
        runValidators: true  // Provjerava validacije pri ažuriranju
      }
    );
    
    if (!proizvod) {
      return res.status(404).json({ 
        message: 'Proizvod nije pronađen' 
      });
    }
    
    res.json({
      message: 'Proizvod uspješno ažuriran',
      proizvod: proizvod
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Greška pri ažuriranju proizvoda', 
      error: err.message 
    });
  }
});

// ==========================================
// DELETE - Brisanje proizvoda po ID-u
// DELETE /api/proizvodi/:id
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const proizvod = await Proizvod.findByIdAndDelete(req.params.id);
    
    if (!proizvod) {
      return res.status(404).json({ 
        message: 'Proizvod nije pronađen' 
      });
    }
    
    res.json({ 
      message: 'Proizvod uspješno obrisan',
      proizvod: proizvod
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri brisanju proizvoda', 
      error: err.message 
    });
  }
});

module.exports = router;
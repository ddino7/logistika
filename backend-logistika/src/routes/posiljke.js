const express = require('express');
const router = express.Router();
const Posiljka = require('../models/Posiljka');

// CREATE
router.post('/', async (req, res) => {
  try {
    const posiljka = new Posiljka(req.body);
    await posiljka.save();
    res.status(201).json({
      message: 'Pošiljka uspješno dodana',
      posiljka: posiljka
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Greška pri dodavanju pošiljke', 
      error: err.message 
    });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const posiljke = await Posiljka.find()
      .populate('proizvodi.proizvod_id')  // Popuni podatke o proizvodima
      .populate('dostavljac_id');         // Popuni podatke o dostavljaču
    res.json({
      count: posiljke.length,
      posiljke: posiljke
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri dohvaćanju pošiljki', 
      error: err.message 
    });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const posiljka = await Posiljka.findById(req.params.id)
      .populate('proizvodi.proizvod_id')
      .populate('dostavljac_id');
    if (!posiljka) {
      return res.status(404).json({ message: 'Pošiljka nije pronađena' });
    }
    res.json(posiljka);
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri dohvaćanju pošiljke', 
      error: err.message 
    });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const posiljka = await Posiljka.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!posiljka) {
      return res.status(404).json({ message: 'Pošiljka nije pronađena' });
    }
    res.json({
      message: 'Pošiljka uspješno ažurirana',
      posiljka: posiljka
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Greška pri ažuriranju pošiljke', 
      error: err.message 
    });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const posiljka = await Posiljka.findByIdAndDelete(req.params.id);
    if (!posiljka) {
      return res.status(404).json({ message: 'Pošiljka nije pronađena' });
    }
    res.json({ 
      message: 'Pošiljka uspješno obrisana',
      posiljka: posiljka
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri brisanju pošiljke', 
      error: err.message 
    });
  }
});

module.exports = router;
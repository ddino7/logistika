const express = require('express');
const router = express.Router();
const Skladiste = require('../models/Skladiste');

// CREATE
router.post('/', async (req, res) => {
  try {
    const skladiste = new Skladiste(req.body);
    await skladiste.save();
    res.status(201).json({
      message: 'Skladište uspješno dodano',
      skladiste: skladiste
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Greška pri dodavanju skladišta', 
      error: err.message 
    });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const skladista = await Skladiste.find();
    res.json({
      count: skladista.length,
      skladista: skladista
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri dohvaćanju skladišta', 
      error: err.message 
    });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const skladiste = await Skladiste.findById(req.params.id);
    if (!skladiste) {
      return res.status(404).json({ message: 'Skladište nije pronađeno' });
    }
    res.json(skladiste);
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri dohvaćanju skladišta', 
      error: err.message 
    });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const skladiste = await Skladiste.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!skladiste) {
      return res.status(404).json({ message: 'Skladište nije pronađeno' });
    }
    res.json({
      message: 'Skladište uspješno ažurirano',
      skladiste: skladiste
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Greška pri ažuriranju skladišta', 
      error: err.message 
    });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const skladiste = await Skladiste.findByIdAndDelete(req.params.id);
    if (!skladiste) {
      return res.status(404).json({ message: 'Skladište nije pronađeno' });
    }
    res.json({ 
      message: 'Skladište uspješno obrisano',
      skladiste: skladiste
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri brisanju skladišta', 
      error: err.message 
    });
  }
});

module.exports = router;
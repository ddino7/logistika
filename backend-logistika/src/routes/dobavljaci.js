const express = require('express');
const router = express.Router();
const Dobavljac = require('../models/Dobavljac');

// CREATE
router.post('/', async (req, res) => {
  try {
    const dobavljac = new Dobavljac(req.body);
    await dobavljac.save();
    res.status(201).json({
      message: 'Dobavljač uspješno dodan',
      dobavljac: dobavljac
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Greška pri dodavanju dobavljača', 
      error: err.message 
    });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const dobavljaci = await Dobavljac.find();
    res.json({
      count: dobavljaci.length,
      dobavljaci: dobavljaci
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri dohvaćanju dobavljača', 
      error: err.message 
    });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const dobavljac = await Dobavljac.findById(req.params.id);
    if (!dobavljac) {
      return res.status(404).json({ message: 'Dobavljač nije pronađen' });
    }
    res.json(dobavljac);
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri dohvaćanju dobavljača', 
      error: err.message 
    });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const dobavljac = await Dobavljac.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!dobavljac) {
      return res.status(404).json({ message: 'Dobavljač nije pronađen' });
    }
    res.json({
      message: 'Dobavljač uspješno ažuriran',
      dobavljac: dobavljac
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Greška pri ažuriranju dobavljača', 
      error: err.message 
    });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const dobavljac = await Dobavljac.findByIdAndDelete(req.params.id);
    if (!dobavljac) {
      return res.status(404).json({ message: 'Dobavljač nije pronađen' });
    }
    res.json({ 
      message: 'Dobavljač uspješno obrisan',
      dobavljac: dobavljac
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Greška pri brisanju dobavljača', 
      error: err.message 
    });
  }
});

module.exports = router;
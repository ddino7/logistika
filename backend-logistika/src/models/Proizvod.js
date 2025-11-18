const mongoose = require('mongoose');

const proizvodSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true,
    trim: true
  },
  kategorija: {
    type: String,
    required: true,
    trim: true
  },
  cijena: {
    type: Number,
    required: true,
    min: 0
  },
  valuta: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'HRK']
  },
  kolicina_na_zalihama: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  dobavljac_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dobavljac',
    required: false
  },
  garancija_mjeseci: {
    type: Number,
    required: false,
    min: 0
  },
  na_zalihi: {
    type: Boolean,
    default: true
  },
  specifikacije: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  }
}, {
  timestamps: true
});

const Proizvod = mongoose.model('Proizvod', proizvodSchema, 'proizvodi');

module.exports = Proizvod;
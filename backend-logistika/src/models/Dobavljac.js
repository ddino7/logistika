const mongoose = require('mongoose');

const dobavljacSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true,
    trim: true
  },
  kontakt: {
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    telefon: {
      type: String,
      required: true
    },
    osoba: {
      type: String,
      required: false
    }
  },
  lokacija: {
    grad: {
      type: String,
      required: true
    },
    drzava: {
      type: String,
      required: true
    },
    adresa: {
      type: String,
      required: true
    }
  },
  certifikati: {
    type: [String],
    default: []
  },
  ocjena: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  godina_osnivanja: {
    type: Number,
    required: false
  },
  broj_zaposlenih: {
    type: Number,
    required: false,
    min: 0
  },
  proizvodi_id: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Proizvod',
    default: []
  }
}, {
  timestamps: true
});

const Dobavljac = mongoose.model('Dobavljac', dobavljacSchema, 'dobavljaci');

module.exports = Dobavljac;
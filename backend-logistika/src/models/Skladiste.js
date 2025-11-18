const mongoose = require('mongoose');

const skladisteSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true,
    trim: true
  },
  lokacija: {
    grad: {
      type: String,
      required: true
    },
    adresa: {
      type: String,
      required: true
    }
  },
  kapacitet_paleta: {
    type: Number,
    required: true,
    min: 0
  },
  zauzetost_postotak: {
    type: Number,
    required: false,
    min: 0,
    max: 100,
    default: 0
  },
  trenutna_popunjenost_m3: {
    type: Number,
    required: false,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['Aktivno', 'Neaktivno', 'U renovaciji'],
    default: 'Aktivno'
  },
  inventar: [
    {
      proizvod_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proizvod',
        required: true
      },
      kolicina: {
        type: Number,
        required: true,
        min: 0
      },
      datum_zadnje_nabave: {
        type: Date,
        required: false
      }
    }
  ],
  radno_vrijeme: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  }
}, {
  timestamps: true
});

const Skladiste = mongoose.model('Skladiste', skladisteSchema, 'skladista');

module.exports = Skladiste;
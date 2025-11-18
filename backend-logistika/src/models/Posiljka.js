const mongoose = require('mongoose');

const posiljkaSchema = new mongoose.Schema({
  broj_posiljke: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  datum_sl: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['U tranzitu', 'Isporučeno', 'Na čekanju', 'Priprema'],
    required: true
  },
  dostavljac: {
    type: String,
    required: true,
    trim: true
  },
  dostavljac_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dobavljac',
    required: false
  },
  proizvodi: [
    {
      proizvod_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proizvod',
        required: true
      },
      kolicina: {
        type: Number,
        required: true,
        min: 1
      },
      cijena_po_komadu: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],
  ukupna_vrijednost: {
    type: Number,
    required: true,
    min: 0
  },
  valuta: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'HRK']
  },
  adresa_dostave: {
    grad: {
      type: String,
      required: true
    },
    adresa: {
      type: String,
      required: true
    },
    kontakt_osoba: {
      type: String,
      required: true
    },
    telefon: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

const Posiljka = mongoose.model('Posiljka', posiljkaSchema, 'posiljke');

module.exports = Posiljka;
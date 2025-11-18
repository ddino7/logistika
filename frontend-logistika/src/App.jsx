import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [activeTab, setActiveTab] = useState('proizvodi');

  return (
    <div className="App">
      <header>
        <h1>Logistika i Lanac Opskrbe</h1>
        <p>CRUD Aplikacija - MongoDB, Express, React, Node.js</p>
      </header>

      <nav className="tabs">
        <button 
          className={activeTab === 'proizvodi' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('proizvodi')}
        >
          Proizvodi
        </button>
        <button 
          className={activeTab === 'dobavljaci' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('dobavljaci')}
        >
          Dobavljači
        </button>
        <button 
          className={activeTab === 'posiljke' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('posiljke')}
        >
          Pošiljke
        </button>
        <button 
          className={activeTab === 'skladista' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('skladista')}
        >
          Skladišta
        </button>
      </nav>

      <main>
        {activeTab === 'proizvodi' && <ProizvodiTab />}
        {activeTab === 'dobavljaci' && <DobavljaciTab />}
        {activeTab === 'posiljke' && <PosiljkeTab />}
        {activeTab === 'skladista' && <SkladistaTab />}
      </main>

      <footer>
        <p>2025 Logistika CRUD App | MongoDB + Express + React + Node.js</p>
      </footer>
    </div>
  );
}

function ProizvodiTab() {
  const [proizvodi, setProizvodi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    naziv: '',
    kategorija: '',
    cijena: '',
    valuta: 'EUR',
    kolicina_na_zalihama: '',
    garancija_mjeseci: '',
    na_zalihi: true
  });

  useEffect(() => {
    fetchProizvodi();
  }, []);

  const fetchProizvodi = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/proizvodi`);
      setProizvodi(response.data.proizvodi || []);
    } catch (err) {
      alert('Greška: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/proizvodi`, formData);
      fetchProizvodi();
      resetForm();
      alert('Proizvod uspješno dodan!');
    } catch (err) {
      alert('Greška: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/proizvodi/${currentId}`, formData);
      fetchProizvodi();
      resetForm();
      alert('Proizvod uspješno ažuriran!');
    } catch (err) {
      alert('Greška: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Jeste li sigurni?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/proizvodi/${id}`);
      fetchProizvodi();
      alert('Proizvod obrisan!');
    } catch (err) {
      alert('Greška: ' + err.message);
    }
  };

  const handleEdit = (p) => {
    setFormData({
      naziv: p.naziv || '',
      kategorija: p.kategorija || '',
      cijena: p.cijena || '',
      valuta: p.valuta || 'EUR',
      kolicina_na_zalihama: p.kolicina_na_zalihama || '',
      garancija_mjeseci: p.garancija_mjeseci || '',
      na_zalihi: p.na_zalihi !== undefined ? p.na_zalihi : true
    });
    setCurrentId(p._id);
    setEditMode(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      naziv: '',
      kategorija: '',
      cijena: '',
      valuta: 'EUR',
      kolicina_na_zalihama: '',
      garancija_mjeseci: '',
      na_zalihi: true
    });
    setCurrentId(null);
    setEditMode(false);
    setShowForm(false);
  };

  return (
    <div className="tab-content">
      <div className="controls">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Zatvori' : 'Dodaj proizvod'}
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={editMode ? handleUpdate : handleCreate}>
          <h3>{editMode ? 'Uredi proizvod' : 'Novi proizvod'}</h3>
          
          <div className="form-row">
            <input type="text" name="naziv" placeholder="Naziv proizvoda" 
              value={formData.naziv} onChange={handleInputChange} required />
            <input type="text" name="kategorija" placeholder="Kategorija" 
              value={formData.kategorija} onChange={handleInputChange} required />
          </div>

          <div className="form-row">
            <input type="number" step="0.01" name="cijena" placeholder="Cijena" 
              value={formData.cijena} onChange={handleInputChange} required />
            <select name="valuta" value={formData.valuta} onChange={handleInputChange}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="HRK">HRK</option>
            </select>
          </div>

          <div className="form-row">
            <input type="number" name="kolicina_na_zalihama" placeholder="Količina na zalihama" 
              value={formData.kolicina_na_zalihama} onChange={handleInputChange} required />
            <input type="number" name="garancija_mjeseci" placeholder="Garancija (mjeseci)" 
              value={formData.garancija_mjeseci} onChange={handleInputChange} />
          </div>

          <div className="form-group-checkbox">
            <label>
              <input type="checkbox" name="na_zalihi" 
                checked={formData.na_zalihi} onChange={handleInputChange} />
              <span>Na zalihi</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editMode ? 'Spremi' : 'Dodaj'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Odustani
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">Učitavanje...</p>
      ) : (
        <div className="table-container">
          <h3>Popis proizvoda ({proizvodi.length})</h3>
          {proizvodi.length === 0 ? (
            <p className="no-data">Nema proizvoda u bazi.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Naziv</th>
                  <th>Kategorija</th>
                  <th>Cijena</th>
                  <th>Zalihe</th>
                  <th>Garancija</th>
                  <th>Status</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {proizvodi.map((p) => (
                  <tr key={p._id}>
                    <td>{p.naziv}</td>
                    <td>{p.kategorija}</td>
                    <td>{p.cijena} {p.valuta}</td>
                    <td>{p.kolicina_na_zalihama}</td>
                    <td>{p.garancija_mjeseci || 'N/A'} mj.</td>
                    <td>{p.na_zalihi ? 'Dostupno' : 'Nedostupno'}</td>
                    <td className="actions">
                      <button className="btn btn-edit" onClick={() => handleEdit(p)}>Uredi</button>
                      <button className="btn btn-delete" onClick={() => handleDelete(p._id)}>Obriši</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function DobavljaciTab() {
  const [dobavljaci, setDobavljaci] = useState([]);
  const [proizvodi, setProizvodi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    naziv: '',
    kontakt: { email: '', telefon: '', osoba: '' },
    lokacija: { grad: '', drzava: '', adresa: '' },
    certifikati: [],
    ocjena: 3,
    godina_osnivanja: '',
    broj_zaposlenih: '',
    proizvodi_id: []
  });

  // Za dodavanje certifikata
  const [noviCertifikat, setNoviCertifikat] = useState('');
  
  // Za dodavanje proizvoda
  const [selectedProizvod, setSelectedProizvod] = useState('');

  useEffect(() => {
    fetchDobavljaci();
    fetchProizvodi();
  }, []);

  const fetchDobavljaci = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/dobavljaci`);
      setDobavljaci(response.data.dobavljaci || []);
    } catch (err) {
      alert('Greška: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProizvodi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/proizvodi`);
      setProizvodi(response.data.proizvodi || []);
    } catch (err) {
      console.error('Greška pri dohvaćanju proizvoda:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Dodaj certifikat
  const handleAddCertifikat = () => {
    if (!noviCertifikat.trim()) {
      alert('Unesite naziv certifikata!');
      return;
    }
    
    if (formData.certifikati.includes(noviCertifikat.trim())) {
      alert('Certifikat već postoji!');
      return;
    }

    setFormData({
      ...formData,
      certifikati: [...formData.certifikati, noviCertifikat.trim()]
    });
    setNoviCertifikat('');
  };

  // Ukloni certifikat
  const handleRemoveCertifikat = (index) => {
    setFormData({
      ...formData,
      certifikati: formData.certifikati.filter((_, i) => i !== index)
    });
  };

  // Dodaj proizvod
  const handleAddProizvod = () => {
    if (!selectedProizvod) {
      alert('Odaberite proizvod!');
      return;
    }

    if (formData.proizvodi_id.includes(selectedProizvod)) {
      alert('Proizvod već postoji u listi!');
      return;
    }

    setFormData({
      ...formData,
      proizvodi_id: [...formData.proizvodi_id, selectedProizvod]
    });
    setSelectedProizvod('');
  };

  // Ukloni proizvod
  const handleRemoveProizvod = (proizvodId) => {
    setFormData({
      ...formData,
      proizvodi_id: formData.proizvodi_id.filter(id => id !== proizvodId)
    });
  };

  // Dohvati naziv proizvoda po ID-u
  const getProizvodNaziv = (proizvodId) => {
    const proizvod = proizvodi.find(p => p._id === proizvodId);
    return proizvod ? proizvod.naziv : 'N/A';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/dobavljaci`, formData);
      fetchDobavljaci();
      resetForm();
      alert('Dobavljač uspješno dodan!');
    } catch (err) {
      alert('Greška: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/dobavljaci/${currentId}`, formData);
      fetchDobavljaci();
      resetForm();
      alert('Dobavljač uspješno ažuriran!');
    } catch (err) {
      alert('Greška: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Jeste li sigurni?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/dobavljaci/${id}`);
      fetchDobavljaci();
      alert('Dobavljač obrisan!');
    } catch (err) {
      alert('Greška: ' + err.message);
    }
  };

  const handleEdit = (d) => {
    setFormData({
      naziv: d.naziv || '',
      kontakt: {
        email: d.kontakt?.email || '',
        telefon: d.kontakt?.telefon || '',
        osoba: d.kontakt?.osoba || ''
      },
      lokacija: {
        grad: d.lokacija?.grad || '',
        drzava: d.lokacija?.drzava || '',
        adresa: d.lokacija?.adresa || ''
      },
      certifikati: d.certifikati || [],
      ocjena: d.ocjena || 3,
      godina_osnivanja: d.godina_osnivanja || '',
      broj_zaposlenih: d.broj_zaposlenih || '',
      proizvodi_id: d.proizvodi_id || []
    });
    setCurrentId(d._id);
    setEditMode(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      naziv: '',
      kontakt: { email: '', telefon: '', osoba: '' },
      lokacija: { grad: '', drzava: '', adresa: '' },
      certifikati: [],
      ocjena: 3,
      godina_osnivanja: '',
      broj_zaposlenih: '',
      proizvodi_id: []
    });
    setNoviCertifikat('');
    setSelectedProizvod('');
    setCurrentId(null);
    setEditMode(false);
    setShowForm(false);
  };

  return (
    <div className="tab-content">
      <div className="controls">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Zatvori' : 'Dodaj dobavljača'}
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={editMode ? handleUpdate : handleCreate}>
          <h3>{editMode ? 'Uredi dobavljača' : 'Novi dobavljač'}</h3>
          
          <div className="form-row">
            <input type="text" name="naziv" placeholder="Naziv tvrtke" 
              value={formData.naziv} onChange={handleInputChange} required />
            <input type="text" name="kontakt.osoba" placeholder="Kontakt osoba" 
              value={formData.kontakt?.osoba || ''} onChange={handleInputChange} />
          </div>

          <div className="form-row">
            <input type="email" name="kontakt.email" placeholder="Email" 
              value={formData.kontakt?.email || ''} onChange={handleInputChange} required />
            <input type="text" name="kontakt.telefon" placeholder="Telefon" 
              value={formData.kontakt?.telefon || ''} onChange={handleInputChange} required />
          </div>

          <div className="form-row">
            <input type="text" name="lokacija.grad" placeholder="Grad" 
              value={formData.lokacija?.grad || ''} onChange={handleInputChange} required />
            <input type="text" name="lokacija.drzava" placeholder="Država" 
              value={formData.lokacija?.drzava || ''} onChange={handleInputChange} required />
          </div>

          <input type="text" name="lokacija.adresa" placeholder="Adresa" 
            value={formData.lokacija?.adresa || ''} onChange={handleInputChange} required />

          <div className="form-row">
            <input type="number" name="godina_osnivanja" placeholder="Godina osnivanja" 
              value={formData.godina_osnivanja} onChange={handleInputChange} />
            <input type="number" name="broj_zaposlenih" placeholder="Broj zaposlenih" 
              value={formData.broj_zaposlenih} onChange={handleInputChange} />
          </div>

          <input type="number" step="0.1" name="ocjena" placeholder="Ocjena (1-5)" 
            min="1" max="5" value={formData.ocjena} onChange={handleInputChange} />

          <h4 className="form-section-title">Certifikati</h4>

          {/* Lista certifikata */}
          {formData.certifikati.length > 0 && (
            <div className="tags-list">
              {formData.certifikati.map((cert, index) => (
                <span key={index} className="tag">
                  {cert}
                  <button 
                    type="button" 
                    className="tag-remove"
                    onClick={() => handleRemoveCertifikat(index)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Forma za dodavanje certifikata */}
          <div className="add-item-section">
            <div className="form-row">
              <input 
                type="text" 
                placeholder="Naziv certifikata (npr. ISO 9001)"
                value={noviCertifikat}
                onChange={(e) => setNoviCertifikat(e.target.value)}
              />
              <button 
                type="button" 
                className="btn btn-success"
                onClick={handleAddCertifikat}
              >
                Dodaj certifikat
              </button>
            </div>
          </div>

          <h4 className="form-section-title">Proizvodi dobavljača</h4>

          {/* Lista proizvoda */}
          {formData.proizvodi_id.length > 0 && (
            <div className="proizvodi-lista-small">
              {formData.proizvodi_id.map((pId, index) => (
                <div key={index} className="proizvod-item">
                  <span>{getProizvodNaziv(pId)}</span>
                  <button 
                    type="button" 
                    className="btn btn-delete btn-small"
                    onClick={() => handleRemoveProizvod(pId)}
                  >
                    Ukloni
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Forma za dodavanje proizvoda */}
          <div className="add-item-section">
            <div className="form-row">
              <select 
                value={selectedProizvod} 
                onChange={(e) => setSelectedProizvod(e.target.value)}
              >
                <option value="">-- Odaberi proizvod --</option>
                {proizvodi.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.naziv}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                className="btn btn-success"
                onClick={handleAddProizvod}
              >
                Dodaj proizvod
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editMode ? 'Spremi' : 'Dodaj'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Odustani
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">Učitavanje...</p>
      ) : (
        <div className="table-container">
          <h3>Popis dobavljača ({dobavljaci.length})</h3>
          {dobavljaci.length === 0 ? (
            <p className="no-data">Nema dobavljača u bazi.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Naziv</th>
                  <th>Kontakt osoba</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th>Grad</th>
                  <th>Država</th>
                  <th>Certifikati</th>
                  <th>Broj proizvoda</th>
                  <th>Ocjena</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {dobavljaci.map((d) => (
                  <tr key={d._id}>
                    <td>{d.naziv}</td>
                    <td>{d.kontakt?.osoba || 'N/A'}</td>
                    <td>{d.kontakt?.email || 'N/A'}</td>
                    <td>{d.kontakt?.telefon || 'N/A'}</td>
                    <td>{d.lokacija?.grad || 'N/A'}</td>
                    <td>{d.lokacija?.drzava || 'N/A'}</td>
                    <td>{d.certifikati?.length || 0}</td>
                    <td>{d.proizvodi_id?.length || 0}</td>
                    <td>{d.ocjena || 'N/A'}/5</td>
                    <td className="actions">
                      <button className="btn btn-edit" onClick={() => handleEdit(d)}>Uredi</button>
                      <button className="btn btn-delete" onClick={() => handleDelete(d._id)}>Obriši</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function PosiljkeTab() {
  const [posiljke, setPosiljke] = useState([]);
  const [proizvodi, setProizvodi] = useState([]); // Lista svih proizvoda
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    broj_posiljke: '',
    datum_sl: '',
    status: 'U tranzitu',
    dostavljac: '',
    ukupna_vrijednost: 0,
    valuta: 'EUR',
    proizvodi: [], // Array proizvoda
    adresa_dostave: {
      grad: '',
      adresa: '',
      kontakt_osoba: '',
      telefon: ''
    }
  });

  // Stanje za dodavanje proizvoda
  const [selectedProizvod, setSelectedProizvod] = useState('');
  const [selectedKolicina, setSelectedKolicina] = useState(1);

  useEffect(() => {
    fetchPosiljke();
    fetchProizvodi(); // Dohvati sve proizvode za dropdown
  }, []);

  const fetchPosiljke = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/posiljke`);
      setPosiljke(response.data.posiljke || []);
    } catch (err) {
      alert('Greška: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProizvodi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/proizvodi`);
      setProizvodi(response.data.proizvodi || []);
    } catch (err) {
      console.error('Greška pri dohvaćanju proizvoda:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Dodaj proizvod u pošiljku
  const handleAddProizvod = () => {
    if (!selectedProizvod || selectedKolicina <= 0) {
      alert('Molimo odaberite proizvod i unesite količinu!');
      return;
    }

    const proizvod = proizvodi.find(p => p._id === selectedProizvod);
    if (!proizvod) {
      alert('Proizvod nije pronađen!');
      return;
    }

    const noviProizvod = {
      proizvod_id: proizvod._id,
      kolicina: parseInt(selectedKolicina),
      cijena_po_komadu: proizvod.cijena
    };

    const updatedProizvodi = [...formData.proizvodi, noviProizvod];
    const novaVrijednost = updatedProizvodi.reduce(
      (sum, p) => sum + (p.kolicina * p.cijena_po_komadu), 
      0
    );

    setFormData({
      ...formData,
      proizvodi: updatedProizvodi,
      ukupna_vrijednost: novaVrijednost
    });

    // Reset selection
    setSelectedProizvod('');
    setSelectedKolicina(1);
  };

  // Ukloni proizvod iz pošiljke
  const handleRemoveProizvod = (index) => {
    const updatedProizvodi = formData.proizvodi.filter((_, i) => i !== index);
    const novaVrijednost = updatedProizvodi.reduce(
      (sum, p) => sum + (p.kolicina * p.cijena_po_komadu), 
      0
    );

    setFormData({
      ...formData,
      proizvodi: updatedProizvodi,
      ukupna_vrijednost: novaVrijednost
    });
  };

  // Dohvati naziv proizvoda po ID-u
  const getProizvodNaziv = (proizvodId) => {
    const proizvod = proizvodi.find(p => p._id === proizvodId);
    return proizvod ? proizvod.naziv : 'N/A';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (formData.proizvodi.length === 0) {
      alert('Molimo dodajte barem jedan proizvod u pošiljku!');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/posiljke`, formData);
      fetchPosiljke();
      resetForm();
      alert('Pošiljka uspješno dodana!');
    } catch (err) {
      alert('Greška: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/posiljke/${currentId}`, formData);
      fetchPosiljke();
      resetForm();
      alert('Pošiljka uspješno ažurirana!');
    } catch (err) {
      alert('Greška: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Jeste li sigurni?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/posiljke/${id}`);
      fetchPosiljke();
      alert('Pošiljka obrisana!');
    } catch (err) {
      alert('Greška: ' + err.message);
    }
  };

  const handleEdit = (p) => {
    setFormData({
      broj_posiljke: p.broj_posiljke || '',
      datum_sl: p.datum_sl ? new Date(p.datum_sl).toISOString().split('T')[0] : '',
      status: p.status || 'U tranzitu',
      dostavljac: p.dostavljac || '',
      ukupna_vrijednost: p.ukupna_vrijednost || 0,
      valuta: p.valuta || 'EUR',
      proizvodi: p.proizvodi || [],
      adresa_dostave: {
        grad: p.adresa_dostave?.grad || '',
        adresa: p.adresa_dostave?.adresa || '',
        kontakt_osoba: p.adresa_dostave?.kontakt_osoba || '',
        telefon: p.adresa_dostave?.telefon || ''
      }
    });
    setCurrentId(p._id);
    setEditMode(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      broj_posiljke: '',
      datum_sl: '',
      status: 'U tranzitu',
      dostavljac: '',
      ukupna_vrijednost: 0,
      valuta: 'EUR',
      proizvodi: [],
      adresa_dostave: {
        grad: '',
        adresa: '',
        kontakt_osoba: '',
        telefon: ''
      }
    });
    setSelectedProizvod('');
    setSelectedKolicina(1);
    setCurrentId(null);
    setEditMode(false);
    setShowForm(false);
  };

  return (
    <div className="tab-content">
      <div className="controls">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Zatvori' : 'Dodaj pošiljku'}
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={editMode ? handleUpdate : handleCreate}>
          <h3>{editMode ? 'Uredi pošiljku' : 'Nova pošiljka'}</h3>
          
          <div className="form-row">
            <input type="text" name="broj_posiljke" placeholder="Broj pošiljke" 
              value={formData.broj_posiljke} onChange={handleInputChange} 
              required disabled={editMode} />
            <input type="date" name="datum_sl" placeholder="Datum slanja" 
              value={formData.datum_sl} onChange={handleInputChange} required />
          </div>

          <div className="form-row">
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="U tranzitu">U tranzitu</option>
              <option value="Isporučeno">Isporučeno</option>
              <option value="Na čekanju">Na čekanju</option>
              <option value="Priprema">Priprema</option>
            </select>
            <input type="text" name="dostavljac" placeholder="Dostavljač" 
              value={formData.dostavljac} onChange={handleInputChange} required />
          </div>

          <div className="form-row">
            <select name="valuta" value={formData.valuta} onChange={handleInputChange}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="HRK">HRK</option>
            </select>
            <input type="number" step="0.01" name="ukupna_vrijednost" 
              placeholder="Ukupna vrijednost (auto-izračun)" 
              value={formData.ukupna_vrijednost} 
              readOnly 
              style={{backgroundColor: '#f3f4f6', cursor: 'not-allowed'}} />
          </div>

          <h4 className="form-section-title">Proizvodi u pošiljci</h4>

          {/* Lista dodanih proizvoda */}
          {formData.proizvodi.length > 0 && (
            <div className="proizvodi-lista">
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Proizvod</th>
                    <th>Količina</th>
                    <th>Cijena/kom</th>
                    <th>Ukupno</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.proizvodi.map((p, index) => (
                    <tr key={index}>
                      <td>{getProizvodNaziv(p.proizvod_id)}</td>
                      <td>{p.kolicina}</td>
                      <td>{p.cijena_po_komadu} {formData.valuta}</td>
                      <td>{(p.kolicina * p.cijena_po_komadu).toFixed(2)} {formData.valuta}</td>
                      <td>
                        <button 
                          type="button" 
                          className="btn btn-delete btn-small"
                          onClick={() => handleRemoveProizvod(index)}
                        >
                          Ukloni
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Forma za dodavanje proizvoda */}
          <div className="add-proizvod-section">
            <div className="form-row">
              <select 
                value={selectedProizvod} 
                onChange={(e) => setSelectedProizvod(e.target.value)}
              >
                <option value="">-- Odaberi proizvod --</option>
                {proizvodi.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.naziv} ({p.cijena} {p.valuta})
                  </option>
                ))}
              </select>
              
              <input 
                type="number" 
                min="1" 
                placeholder="Količina"
                value={selectedKolicina}
                onChange={(e) => setSelectedKolicina(e.target.value)}
              />
            </div>
            
            <button 
              type="button" 
              className="btn btn-success"
              onClick={handleAddProizvod}
            >
              Dodaj proizvod u pošiljku
            </button>
          </div>

          <h4 className="form-section-title">Adresa dostave</h4>

          <div className="form-row">
            <input type="text" name="adresa_dostave.grad" placeholder="Grad" 
              value={formData.adresa_dostave?.grad || ''} onChange={handleInputChange} required />
            <input type="text" name="adresa_dostave.adresa" placeholder="Adresa" 
              value={formData.adresa_dostave?.adresa || ''} onChange={handleInputChange} required />
          </div>

          <div className="form-row">
            <input type="text" name="adresa_dostave.kontakt_osoba" placeholder="Kontakt osoba" 
              value={formData.adresa_dostave?.kontakt_osoba || ''} onChange={handleInputChange} required />
            <input type="text" name="adresa_dostave.telefon" placeholder="Telefon" 
              value={formData.adresa_dostave?.telefon || ''} onChange={handleInputChange} required />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editMode ? 'Spremi' : 'Dodaj'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Odustani
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">Učitavanje...</p>
      ) : (
        <div className="table-container">
          <h3>Popis pošiljki ({posiljke.length})</h3>
          {posiljke.length === 0 ? (
            <p className="no-data">Nema pošiljki u bazi.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Broj pošiljke</th>
                  <th>Datum</th>
                  <th>Status</th>
                  <th>Dostavljač</th>
                  <th>Grad dostave</th>
                  <th>Broj proizvoda</th>
                  <th>Vrijednost</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {posiljke.map((p) => (
                  <tr key={p._id}>
                    <td>{p.broj_posiljke}</td>
                    <td>{new Date(p.datum_sl).toLocaleDateString('hr-HR')}</td>
                    <td>{p.status}</td>
                    <td>{p.dostavljac}</td>
                    <td>{p.adresa_dostave?.grad || 'N/A'}</td>
                    <td>{p.proizvodi?.length || 0}</td>
                    <td>{p.ukupna_vrijednost?.toFixed(2)} {p.valuta}</td>
                    <td className="actions">
                      <button className="btn btn-edit" onClick={() => handleEdit(p)}>Uredi</button>
                      <button className="btn btn-delete" onClick={() => handleDelete(p._id)}>Obriši</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function SkladistaTab() {
  const [skladista, setSkladista] = useState([]);
  const [proizvodi, setProizvodi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    naziv: '',
    lokacija: { grad: '', adresa: '' },
    kapacitet_paleta: '',
    zauzetost_postotak: '',
    trenutna_popunjenost_m3: '',
    status: 'Aktivno',
    inventar: []
  });

  // Za dodavanje u inventar
  const [selectedProizvod, setSelectedProizvod] = useState('');
  const [selectedKolicina, setSelectedKolicina] = useState(1);
  const [selectedDatum, setSelectedDatum] = useState('');

  useEffect(() => {
    fetchSkladista();
    fetchProizvodi();
  }, []);

  const fetchSkladista = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/skladista`);
      setSkladista(response.data.skladista || []);
    } catch (err) {
      alert('Greška: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProizvodi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/proizvodi`);
      setProizvodi(response.data.proizvodi || []);
    } catch (err) {
      console.error('Greška pri dohvaćanju proizvoda:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Dodaj proizvod u inventar
  const handleAddInventar = () => {
    if (!selectedProizvod || selectedKolicina <= 0) {
      alert('Odaberite proizvod i unesite količinu!');
      return;
    }

    const postojiProizvod = formData.inventar.find(
      item => item.proizvod_id === selectedProizvod
    );

    if (postojiProizvod) {
      alert('Proizvod već postoji u inventaru! Možete ga urediti.');
      return;
    }

    const noviItem = {
      proizvod_id: selectedProizvod,
      kolicina: parseInt(selectedKolicina),
      datum_zadnje_nabave: selectedDatum || new Date().toISOString().split('T')[0]
    };

    setFormData({
      ...formData,
      inventar: [...formData.inventar, noviItem]
    });

    // Reset
    setSelectedProizvod('');
    setSelectedKolicina(1);
    setSelectedDatum('');
  };

  // Ukloni proizvod iz inventara
  const handleRemoveInventar = (proizvodId) => {
    setFormData({
      ...formData,
      inventar: formData.inventar.filter(item => item.proizvod_id !== proizvodId)
    });
  };

  // Dohvati naziv proizvoda po ID-u
  const getProizvodNaziv = (proizvodId) => {
    const proizvod = proizvodi.find(p => p._id === proizvodId);
    return proizvod ? proizvod.naziv : 'N/A';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/skladista`, formData);
      fetchSkladista();
      resetForm();
      alert('Skladište uspješno dodano!');
    } catch (err) {
      alert('Greška: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/skladista/${currentId}`, formData);
      fetchSkladista();
      resetForm();
      alert('Skladište uspješno ažurirano!');
    } catch (err) {
      alert('Greška: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Jeste li sigurni?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/skladista/${id}`);
      fetchSkladista();
      alert('Skladište obrisano!');
    } catch (err) {
      alert('Greška: ' + err.message);
    }
  };

  const handleEdit = (s) => {
    setFormData({
      naziv: s.naziv || '',
      lokacija: {
        grad: s.lokacija?.grad || '',
        adresa: s.lokacija?.adresa || ''
      },
      kapacitet_paleta: s.kapacitet_paleta || '',
      zauzetost_postotak: s.zauzetost_postotak || '',
      trenutna_popunjenost_m3: s.trenutna_popunjenost_m3 || '',
      status: s.status || 'Aktivno',
      inventar: s.inventar || []
    });
    setCurrentId(s._id);
    setEditMode(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      naziv: '',
      lokacija: { grad: '', adresa: '' },
      kapacitet_paleta: '',
      zauzetost_postotak: '',
      trenutna_popunjenost_m3: '',
      status: 'Aktivno',
      inventar: []
    });
    setSelectedProizvod('');
    setSelectedKolicina(1);
    setSelectedDatum('');
    setCurrentId(null);
    setEditMode(false);
    setShowForm(false);
  };

  return (
    <div className="tab-content">
      <div className="controls">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Zatvori' : 'Dodaj skladište'}
        </button>
      </div>

      {showForm && (
        <form className="form-container" onSubmit={editMode ? handleUpdate : handleCreate}>
          <h3>{editMode ? 'Uredi skladište' : 'Novo skladište'}</h3>
          
          <input type="text" name="naziv" placeholder="Naziv skladišta" 
            value={formData.naziv} onChange={handleInputChange} required />

          <div className="form-row">
            <input type="text" name="lokacija.grad" placeholder="Grad" 
              value={formData.lokacija?.grad || ''} onChange={handleInputChange} required />
            <input type="text" name="lokacija.adresa" placeholder="Adresa" 
              value={formData.lokacija?.adresa || ''} onChange={handleInputChange} required />
          </div>

          <div className="form-row">
            <input type="number" name="kapacitet_paleta" placeholder="Kapacitet paleta" 
              value={formData.kapacitet_paleta} onChange={handleInputChange} required />
            <input type="number" step="0.01" name="trenutna_popunjenost_m3" 
              placeholder="Popunjenost m3" 
              value={formData.trenutna_popunjenost_m3} onChange={handleInputChange} />
          </div>

          <div className="form-row">
            <input type="number" step="0.1" name="zauzetost_postotak" 
              placeholder="Zauzetost %" min="0" max="100"
              value={formData.zauzetost_postotak} onChange={handleInputChange} />
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="Aktivno">Aktivno</option>
              <option value="Neaktivno">Neaktivno</option>
              <option value="U renovaciji">U renovaciji</option>
            </select>
          </div>

          <h4 className="form-section-title">Inventar skladišta</h4>

          {/* Lista inventara */}
          {formData.inventar.length > 0 && (
            <div className="proizvodi-lista">
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Proizvod</th>
                    <th>Količina</th>
                    <th>Datum zadnje nabave</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.inventar.map((item, index) => (
                    <tr key={index}>
                      <td>{getProizvodNaziv(item.proizvod_id)}</td>
                      <td>{item.kolicina}</td>
                      <td>{item.datum_zadnje_nabave ? new Date(item.datum_zadnje_nabave).toLocaleDateString('hr-HR') : 'N/A'}</td>
                      <td>
                        <button 
                          type="button" 
                          className="btn btn-delete btn-small"
                          onClick={() => handleRemoveInventar(item.proizvod_id)}
                        >
                          Ukloni
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Forma za dodavanje u inventar */}
          <div className="add-proizvod-section">
            <div className="form-row">
              <select 
                value={selectedProizvod} 
                onChange={(e) => setSelectedProizvod(e.target.value)}
              >
                <option value="">-- Odaberi proizvod --</option>
                {proizvodi.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.naziv}
                  </option>
                ))}
              </select>
              
              <input 
                type="number" 
                min="1" 
                placeholder="Količina"
                value={selectedKolicina}
                onChange={(e) => setSelectedKolicina(e.target.value)}
              />
            </div>

            <input 
              type="date" 
              placeholder="Datum zadnje nabave"
              value={selectedDatum}
              onChange={(e) => setSelectedDatum(e.target.value)}
            />
            
            <button 
              type="button" 
              className="btn btn-success"
              onClick={handleAddInventar}
              style={{marginTop: '10px'}}
            >
              Dodaj u inventar
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editMode ? 'Spremi' : 'Dodaj'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Odustani
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">Učitavanje...</p>
      ) : (
        <div className="table-container">
          <h3>Popis skladišta ({skladista.length})</h3>
          {skladista.length === 0 ? (
            <p className="no-data">Nema skladišta u bazi.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Naziv</th>
                  <th>Grad</th>
                  <th>Kapacitet paleta</th>
                  <th>Zauzetost</th>
                  <th>Status</th>
                  <th>Broj proizvoda</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {skladista.map((s) => (
                  <tr key={s._id}>
                    <td>{s.naziv}</td>
                    <td>{s.lokacija?.grad || 'N/A'}</td>
                    <td>{s.kapacitet_paleta}</td>
                    <td>{s.zauzetost_postotak}%</td>
                    <td>{s.status}</td>
                    <td>{s.inventar?.length || 0}</td>
                    <td className="actions">
                      <button className="btn btn-edit" onClick={() => handleEdit(s)}>Uredi</button>
                      <button className="btn btn-delete" onClick={() => handleDelete(s._id)}>Obriši</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
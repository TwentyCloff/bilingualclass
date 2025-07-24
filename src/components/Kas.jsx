import React, { useState } from 'react';
import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const names = [
  "Alicia", "Aurelia", "Chalisa", "Dahlia", "Danu", 
  "Dara", "Fairuz", "Falan", "Fathul", "Firly", 
  "Fredy", "Hatyu", "Jessica", "Kalinda", "Kania", 
  "Keisha", "Kenzo", "Laras", "Lukas", "Fakhar", 
  "Fiqry", "Firza", "Nadine", "Nazwa", "Quinsha", 
  "Mecca", "Aisy", "Salsabiela", "Sandi", "Shabrina", 
  "Shafira", "Humaira", "Tiara", "Utin", "Willy"
];

const Kas = () => {
  const [selectedName, setSelectedName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedName || !amount) return;

    setLoading(true);
    try {
      // Create a document with the person's name as ID
      await setDoc(doc(db, "kas_entries", selectedName), {
        name: selectedName,
        amount: parseFloat(amount),
        timestamp: serverTimestamp()
      }, { merge: true }); // Merge if document exists

      setSuccess(true);
      setSelectedName('');
      setAmount('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Input Kas</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nama:</label>
          <select 
            value={selectedName} 
            onChange={(e) => setSelectedName(e.target.value)}
            required
          >
            <option value="">Pilih Nama</option>
            {names.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Jumlah:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Masukkan jumlah"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
        
        {success && <p className="success">Data berhasil disimpan!</p>}
      </form>
    </div>
  );
};

export default Kas;

import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

const Manage = () => {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "kas_entries"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entriesData = [];
      let totalAmount = 0;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entriesData.push(data);
        totalAmount += data.amount || 0;
      });
      
      setEntries(entriesData);
      setTotal(totalAmount);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading data...</div>;

  return (
    <div className="container">
      <h2>Manajemen Kas</h2>
      
      <div className="summary">
        <h3>Total Saldo: Rp {total.toLocaleString()}</h3>
      </div>
      
      <div className="entries-list">
        <h3>Daftar Kontribusi:</h3>
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jumlah</th>
              <th>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name}</td>
                <td>Rp {entry.amount?.toLocaleString()}</td>
                <td>{entry.timestamp?.toDate().toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manage;

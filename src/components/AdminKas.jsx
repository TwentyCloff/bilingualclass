import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, User, FileText, BarChart2, Trash2 } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const studentList = [
  'Alicia', 'Aurelia', 'Chalisa', 'Dahlia', 'Danu', 'Dara', 'Fairuz',
  'Falan', 'Fathul', 'Firly', 'Fredy', 'Hatyu', 'Jessica', 'Kalinda',
  'Kania', 'Keisha', 'Kenzo', 'Laras', 'Lukas', 'Fakhar', 'Fiqry',
  'Firza', 'Nadine', 'Nazwa', 'Quinsha', 'Mecca', 'Aisy', 'Salsabiela',
  'Sandi', 'Shabrina', 'Shafira', 'Humaira', 'Tiara', 'Utin', 'Willy'
];

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function AdminKas() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('histori');
  const [kasData, setKasData] = useState([]);
  const [pengeluaranData, setPengeluaranData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const monthName = months[selectedMonth];
    const kasQuery = query(
      collection(db, 'kas'),
      where('month', '==', monthName),
      where('year', '==', selectedYear),
      orderBy('timestamp', 'desc')
    );

    const pengeluaranQuery = query(
      collection(db, 'pengeluaran'),
      where('month', '==', monthName),
      where('year', '==', selectedYear),
      orderBy('timestamp', 'desc')
    );

    const unsubscribeKas = onSnapshot(kasQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.()
      }));
      setKasData(data);
      setLoading(false);
    });

    const unsubscribePengeluaran = onSnapshot(pengeluaranQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.()
      }));
      setPengeluaranData(data);
    });

    return () => {
      unsubscribeKas();
      unsubscribePengeluaran();
    };
  }, [selectedMonth, selectedYear]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('id-ID');
  };

  const totalKas = kasData.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalPengeluaran = pengeluaranData.reduce((sum, item) => sum + (item.amount || 0), 0);
  const saldo = totalKas - totalPengeluaran;

  const groupByStudent = () => {
    const grouped = {};
    kasData.forEach(item => {
      if (!grouped[item.studentName]) {
        grouped[item.studentName] = { total: 0, payments: [] };
      }
      grouped[item.studentName].total += item.amount || 0;
      grouped[item.studentName].payments.push(item);
    });
    return grouped;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 mb-8">
          <ArrowLeft className="mr-2" /> Kembali
        </button>

        <h1 className="text-3xl font-bold mb-6">Admin Kas Kelas</h1>

        <div className="flex gap-4 mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-gray-800 p-2 rounded"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-gray-800 p-2 rounded"
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400">Total Kas</p>
            <p className="text-2xl font-bold">{formatPrice(totalKas)}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400">Total Pengeluaran</p>
            <p className="text-2xl font-bold">{formatPrice(totalPengeluaran)}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400">Saldo</p>
            <p className="text-2xl font-bold">{formatPrice(saldo)}</p>
          </div>
        </div>

        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('histori')}
            className={`px-4 py-2 ${activeTab === 'histori' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Histori Transaksi
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-4 py-2 ${activeTab === 'rekap' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Rekap Siswa
          </button>
        </div>

        {activeTab === 'histori' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Kas Masuk</h2>
            <div className="space-y-2 mb-8">
              {loading ? (
                <p>Memuat data...</p>
              ) : kasData.length === 0 ? (
                <p>Tidak ada data kas</p>
              ) : (
                kasData.map(item => (
                  <div key={item.id} className="bg-gray-900 p-4 rounded-lg flex justify-between">
                    <div>
                      <p className="font-bold">{item.studentName}</p>
                      <p className="text-gray-400">{formatDate(item.date)} - Minggu {item.week}</p>
                      {item.note && <p className="text-sm text-gray-500">Catatan: {item.note}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-green-500 font-bold">{formatPrice(item.amount)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <h2 className="text-xl font-bold mb-4">Pengeluaran</h2>
            <div className="space-y-2">
              {pengeluaranData.length === 0 ? (
                <p>Tidak ada data pengeluaran</p>
              ) : (
                pengeluaranData.map(item => (
                  <div key={item.id} className="bg-gray-900 p-4 rounded-lg flex justify-between">
                    <div>
                      <p className="font-bold">{item.description}</p>
                      <p className="text-gray-400">{formatDate(item.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-500 font-bold">{formatPrice(item.amount)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'rekap' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Rekap Pembayaran Siswa</h2>
            <div className="space-y-4">
              {Object.entries(groupByStudent()).map(([name, data]) => (
                <div key={name} className="bg-gray-900 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold">{name}</p>
                    <p className="font-bold">{formatPrice(data.total)}</p>
                  </div>
                  <div className="pl-4 border-l border-gray-700 space-y-2">
                    {data.payments.map(payment => (
                      <div key={payment.id} className="flex justify-between text-sm">
                        <p>{formatDate(payment.date)} (Minggu {payment.week})</p>
                        <p className="text-green-500">{formatPrice(payment.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

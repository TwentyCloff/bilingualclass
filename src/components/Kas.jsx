import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, User, Trash2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const studentList = [
  'Alicia', 'Aurelia', 'Chalisa', 'Dahlia', 'Danu', 'Dara', 'Fairuz',
  'Falan', 'Fathul', 'Firly', 'Fredy', 'Hatyu', 'Jessica', 'Kalinda',
  'Kania', 'Keisha', 'Kenzo', 'Laras', 'Lukas', 'Fakhar', 'Fiqry',
  'Firza', 'Nadine', 'Nazwa', 'Quinsha', 'Mecca', 'Aisy', 'Salsabiela',
  'Sandi', 'Shabrina', 'Shafira', 'Humaira', 'Tiara', 'Utin', 'Willy'
];

export default function Kas() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [totalKas, setTotalKas] = useState(0);
  const [pengeluaran, setPengeluaran] = useState(0);
  const [kasHariIni, setKasHariIni] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ amount: '', week: '1', note: '' });

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('id-ID', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const kasQuery = query(collection(db, 'kas'), orderBy('timestamp', 'desc'));
    const unsubscribeKas = onSnapshot(kasQuery, async (querySnapshot) => {
      let total = 0;
      let todayTotal = 0;
      const today = new Date().toDateString();
      const studentPayments = {};
      
      studentList.forEach(student => {
        studentPayments[student] = { payments: [], total: 0 };
      });

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const amount = data.amount || 0;
        total += amount;
        
        if (new Date(data.date?.toDate?.()).toDateString() === today) {
          todayTotal += amount;
        }
        
        if (data.studentName && studentPayments[data.studentName]) {
          studentPayments[data.studentName].payments.push({
            id: doc.id,
            ...data,
            date: data.date?.toDate?.() || null
          });
          studentPayments[data.studentName].total += amount;
        }
      });
      
      const pengeluaranQuery = query(collection(db, 'pengeluaran'));
      const pengeluaranSnapshot = await getDocs(pengeluaranQuery);
      let totalPengeluaran = 0;
      
      pengeluaranSnapshot.forEach((doc) => {
        totalPengeluaran += doc.data().amount || 0;
      });

      setTotalKas(total);
      setPengeluaran(totalPengeluaran);
      setKasHariIni(todayTotal);
      
      const formattedStudents = studentList.map(name => ({
        name,
        payments: studentPayments[name]?.payments || [],
        totalPaid: studentPayments[name]?.total || 0
      }));
      
      setStudents(formattedStudents);
    });

    return () => unsubscribeKas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !selectedStudent) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      const docId = `${selectedStudent}_${now.getTime()}`;
      const amount = parseFloat(formData.amount);
      
      await setDoc(doc(db, 'kas', docId), {
        studentName: selectedStudent,
        amount,
        week: formData.week,
        note: formData.note.trim(),
        date: now,
        month: currentMonth,
        year: currentYear,
        timestamp: now.getTime()
      });
      
      setPopupMessage(`Pembayaran ${formatPrice(amount)} untuk ${selectedStudent} berhasil!`);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      setFormData({ amount: '', week: '1', note: '' });
      setShowPaymentForm(false);
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('Gagal menyimpan pembayaran!');
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 mb-8">
          <ArrowLeft className="mr-2" /> Kembali
        </button>

        <h1 className="text-3xl font-bold mb-6">Kas Kelas</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400">Total Kas</p>
            <p className="text-2xl font-bold">{formatPrice(totalKas)}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400">Pengeluaran</p>
            <p className="text-2xl font-bold">{formatPrice(pengeluaran)}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400">Kas Hari Ini</p>
            <p className="text-2xl font-bold">{formatPrice(kasHariIni)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {studentList.map((student) => (
            <div 
              key={student} 
              onClick={() => {
                setSelectedStudent(student);
                setShowPaymentForm(true);
              }}
              className="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 cursor-pointer"
            >
              <p className="font-medium">{student}</p>
              <p className="text-sm text-gray-400">
                {students.find(s => s.name === student)?.payments.length || 0} pembayaran
              </p>
            </div>
          ))}
        </div>

        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Catat Pembayaran - {selectedStudent}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2">Jumlah (Rp)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-gray-800 p-2 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Minggu</label>
                  <select
                    value={formData.week}
                    onChange={(e) => setFormData({...formData, week: e.target.value})}
                    className="w-full bg-gray-800 p-2 rounded"
                  >
                    {[1,2,3,4].map(week => (
                      <option key={week} value={week.toString()}>Minggu {week}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Catatan (Opsional)</label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full bg-gray-800 p-2 rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex-1"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPopup && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 px-4 py-2 rounded">
            {popupMessage}
          </div>
        )}
      </div>
    </div>
  );
}

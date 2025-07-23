import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit3, DollarSign, Calendar, User } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, setDoc, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

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

  // Form states
  const [formData, setFormData] = useState({
    amount: '',
    week: '1',
    note: ''
  });

  const studentList = [
    'Alicia', 'Aurelia', 'Chalisa', 'Dahlia', 'Danu', 'Dara', 'Fairuz', 
    'Falan', 'Fathul', 'Firly', 'Fredy', 'Hatyu', 'Jessica', 'Kalinda', 
    'Kania', 'Keisha', 'Kenzo', 'Laras', 'Lukas', 'Fakhar', 'Fiqry', 
    'Firza', 'Nadine', 'Nazwa', 'Quinsha', 'Mecca', 'Aisy', 'Salsabiela', 
    'Sandi', 'Shabrina', 'Shafira', 'Humaira', 'Tiara', 'Utin', 'Willy'
  ];

  const weeks = ['1', '2', '3', '4'];

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('id-ID', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Realtime listeners for kas data
  useEffect(() => {
    // Listen for all kas entries
    const kasQuery = query(collection(db, 'kas'), orderBy('date', 'desc'));
    const unsubscribeKas = onSnapshot(kasQuery, 
      async (querySnapshot) => {
        let total = 0;
        let todayTotal = 0;
        const today = new Date().toDateString();
        const studentPayments = {};
        
        // Initialize all students with empty data
        studentList.forEach(student => {
          studentPayments[student] = { payments: [], total: 0 };
        });

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const amount = data.amount || 0;
          
          // Calculate totals
          total += amount;
          
          // Calculate today's kas
          if (new Date(data.date?.toDate?.()).toDateString() === today) {
            todayTotal += amount;
          }
          
          // Organize by student
          if (data.studentName && studentPayments[data.studentName]) {
            studentPayments[data.studentName].payments.push({
              id: doc.id,
              ...data,
              date: data.date?.toDate?.() || null
            });
            studentPayments[data.studentName].total += amount;
          }
        });
        
        // Calculate pengeluaran (expenses)
        const pengeluaranQuery = query(collection(db, 'pengeluaran'));
        const pengeluaranSnapshot = await getDocs(pengeluaranQuery);
        let totalPengeluaran = 0;
        
        pengeluaranSnapshot.forEach((doc) => {
          totalPengeluaran += doc.data().amount || 0;
        });

        setTotalKas(total);
        setPengeluaran(totalPengeluaran);
        setKasHariIni(todayTotal);
        
        // Prepare student data for display
        const formattedStudents = studentList.map(name => ({
          name,
          payments: studentPayments[name]?.payments || [],
          totalPaid: studentPayments[name]?.total || 0
        }));
        
        setStudents(formattedStudents);
      },
      (error) => {
        console.error("Error loading kas data:", error);
      }
    );
    
    return () => {
      unsubscribeKas();
    };
  }, []);

  const resetForm = () => {
    setFormData({
      amount: '',
      week: '1',
      note: ''
    });
    setSelectedStudent(null);
  };

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
        year: currentYear
      });
      
      setPopupMessage(`Payment of ${formatPrice(amount)} recorded for ${selectedStudent}!`);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      
      resetForm();
      setShowPaymentForm(false);
    } catch (error) {
      console.error('Error recording payment:', error);
      setPopupMessage('Error recording payment!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to delete this payment record?')) return;
    
    try {
      await deleteDoc(doc(db, 'kas', paymentId));
      setPopupMessage('Payment record deleted!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error deleting payment:', error);
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>

      <div className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-400 hover:text-white mr-8 transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-light tracking-wider bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
                Kas Kelas
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mt-4 mb-2"></div>
              <p className="text-gray-400 font-light">Manage class finances</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Kas */}
          <div className="border border-white/10 p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Kas</p>
                <p className="text-2xl font-bold">{formatPrice(totalKas)}</p>
              </div>
            </div>
          </div>

          {/* Pengeluaran */}
          <div className="border border-white/10 p-6 rounded-lg bg-gradient-to-br from-red-600/20 to-orange-500/20 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Pengeluaran</p>
                <p className="text-2xl font-bold">{formatPrice(pengeluaran)}</p>
              </div>
            </div>
          </div>

          {/* Kas Hari Ini */}
          <div className="border border-white/10 p-6 rounded-lg bg-gradient-to-br from-green-600/20 to-teal-500/20 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Kas Hari Ini</p>
                <p className="text-2xl font-bold">{formatPrice(kasHariIni)}</p>
                <p className="text-xs text-gray-400 mt-1">{currentDate.toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-6">
          <h2 className="text-xl font-light tracking-wider mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-white/60" />
            Daftar Siswa ({students.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {students.map((student) => (
              <div 
                key={student.name} 
                onClick={() => {
                  setSelectedStudent(student.name);
                  setShowPaymentForm(true);
                }}
                className="border border-white/10 p-4 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{student.name}</h3>
                  <span className="text-xs bg-white/5 px-2 py-1 rounded">
                    {student.payments.length} payments
                  </span>
                </div>
                <div className="mt-2 text-green-400 text-sm">
                  Total: {formatPrice(student.totalPaid)}
                </div>
                {student.payments.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    Last: {formatDate(student.payments[0]?.date)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="border border-white/20 p-6 rounded-lg bg-black/90 backdrop-blur-sm w-full max-w-md">
              <h3 className="text-xl font-light mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Record Payment for {selectedStudent}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                    Amount (IDR) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                      Week
                    </label>
                    <select
                      value={formData.week}
                      onChange={(e) => setFormData({...formData, week: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300"
                    >
                      {weeks.map((week) => (
                        <option key={week} value={week}>Minggu {week}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                      Period
                    </label>
                    <div className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg">
                      <p className="text-sm">{currentMonth} {currentYear}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300"
                    placeholder="Payment note"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Record Payment
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentForm(false);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 border border-green-500/30 px-6 py-3 rounded-lg shadow-lg z-50 backdrop-blur-md animate-fade-in">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <p className="text-green-400">{popupMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

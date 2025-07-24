import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { database } from '../config/firebaseConfig';
import { ref, push, onValue } from 'firebase/database';

const KasPayment = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [amount, setAmount] = useState('');
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(false);
  
  const students = [
    'Alicia', 'Aurelia', 'Chalisa', 'Dahlia', 'Danu', 'Dara', 'Fairuz', 'Falan', 
    'Fathul', 'Firly', 'Fredy', 'Hayyu', 'Jessica', 'Kalinda', 'Kania', 'Keisha', 
    'Kenzo', 'Laras', 'Lukas', 'Fakhar', 'Fiqry', 'Firza', 'Nadine', 'Nazwa', 
    'Quinsha', 'Mecca', 'Aisy', 'Salsabiela', 'Sandi', 'Shabrina', 'Shafira', 
    'Humaira', 'Tiara', 'Utin', 'Willy'
  ];

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const weeks = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];

  // Setup Firebase listener untuk real-time updates
  useEffect(() => {
    const paymentsRef = ref(database, 'payments');
    const unsubscribe = onValue(paymentsRef, (snapshot) => {
      if (snapshot.exists()) {
        setPayments(snapshot.val());
      } else {
        setPayments({});
      }
    });

    return () => unsubscribe();
  }, []);

  // Cek apakah siswa sudah bayar di minggu tertentu
  const isWeekPaid = (student, month, year, week) => {
    return Object.values(payments).some(payment => 
      payment.student === student && 
      payment.month === month && 
      payment.year === year && 
      payment.week === week &&
      payment.status === 'paid'
    );
  };

  // Get available weeks untuk siswa yang dipilih
  const getAvailableWeeks = () => {
    if (!selectedStudent || !selectedMonth || !selectedYear) return weeks;
    
    return weeks.filter(week => 
      !isWeekPaid(selectedStudent, selectedMonth, selectedYear, week)
    );
  };

  // Handle pembayaran
  const handlePayment = async () => {
    if (!selectedStudent || !selectedWeek || !selectedMonth || !selectedYear || !amount) {
      alert('Mohon lengkapi semua field!');
      return;
    }

    if (isWeekPaid(selectedStudent, selectedMonth, selectedYear, selectedWeek)) {
      alert('Siswa sudah membayar di minggu ini!');
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        student: selectedStudent,
        week: selectedWeek,
        month: selectedMonth,
        year: selectedYear,
        amount: parseFloat(amount),
        status: 'paid',
        timestamp: Date.now(),
        date: new Date().toISOString()
      };

      await push(ref(database, 'payments'), paymentData);

      // Reset form
      setSelectedStudent('');
      setSelectedWeek('');
      setAmount('');
      
      alert('Pembayaran berhasil dicatat!');
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan pembayaran!');
    } finally {
      setLoading(false);
    }
  };

  const availableWeeks = getAvailableWeeks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center mb-8">
          <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Pembayaran Kas</h1>
          <p className="text-gray-600 mt-2">Input pembayaran kas kelas</p>
        </div>

        <div className="space-y-6">
          {/* Pilih Siswa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Pilih Siswa
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Pilih Siswa --</option>
              {students.map((student) => (
                <option key={student} value={student}>{student}</option>
              ))}
            </select>
          </div>

          {/* Pilih Tahun */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Tahun
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          {/* Pilih Bulan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Bulan
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Pilih Bulan --</option>
              {months.map((month, index) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          {/* Pilih Minggu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Minggu
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!selectedStudent || !selectedMonth || !selectedYear}
            >
              <option value="">-- Pilih Minggu --</option>
              {availableWeeks.map((week) => (
                <option key={week} value={week}>{week}</option>
              ))}
            </select>
            {selectedStudent && selectedMonth && selectedYear && availableWeeks.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Semua minggu sudah dibayar untuk siswa ini
              </p>
            )}
          </div>

          {/* Input Jumlah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Jumlah (Rp)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Masukkan jumlah kas"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Pembayaran Siswa */}
          {selectedStudent && selectedMonth && selectedYear && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Status Pembayaran {selectedStudent}</h3>
              <div className="grid grid-cols-2 gap-2">
                {weeks.map((week) => {
                  const isPaid = isWeekPaid(selectedStudent, selectedMonth, selectedYear, week);
                  return (
                    <div
                      key={week}
                      className={`p-2 rounded-lg text-sm font-medium flex items-center justify-center ${
                        isPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isPaid && <CheckCircle className="w-4 h-4 mr-1" />}
                      {week}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Button Submit */}
          <button
            onClick={handlePayment}
            disabled={loading || !selectedStudent || !selectedWeek || !selectedMonth || !selectedYear || !amount}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Catat Pembayaran
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KasPayment;

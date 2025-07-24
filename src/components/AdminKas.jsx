import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { database } from '../config/firebaseConfig';
import { ref, onValue } from 'firebase/database';

const KasMonitoring = () => {
  const [payments, setPayments] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [searchStudent, setSearchStudent] = useState('');
  const [loading, setLoading] = useState(true);
  
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get statistik umum
  const getGeneralStats = () => {
    const paymentArray = Object.values(payments);
    const totalAmount = paymentArray.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const totalPayments = paymentArray.length;
    const uniqueStudents = new Set(paymentArray.map(p => p.student)).size;
    
    return {
      totalAmount,
      totalPayments,
      uniqueStudents,
      totalStudents: students.length
    };
  };

  // Get data untuk chart per minggu
  const getWeeklyData = () => {
    const weeklyData = weeks.map(week => {
      const weekPayments = Object.values(payments).filter(payment => 
        payment.week === week && 
        (!selectedMonth || payment.month === selectedMonth) &&
        (!selectedYear || payment.year === selectedYear)
      );
      
      return {
        week,
        jumlah: weekPayments.length,
        total: weekPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
      };
    });
    
    return weeklyData;
  };

  // Get data untuk pie chart status pembayaran
  const getPaymentStatusData = () => {
    if (!selectedMonth || !selectedYear) return [];
    
    const totalExpected = students.length * 4; // 4 minggu per bulan
    const paidCount = Object.values(payments).filter(payment => 
      payment.month === selectedMonth && payment.year === selectedYear
    ).length;
    
    return [
      { name: 'Sudah Bayar', value: paidCount, color: '#10B981' },
      { name: 'Belum Bayar', value: totalExpected - paidCount, color: '#EF4444' }
    ];
  };

  // Get detail siswa dengan filter
  const getStudentDetails = () => {
    const filteredStudents = students.filter(student => 
      student.toLowerCase().includes(searchStudent.toLowerCase())
    );

    return filteredStudents.map(student => {
      const studentPayments = Object.values(payments).filter(payment => 
        payment.student === student &&
        (!selectedMonth || payment.month === selectedMonth) &&
        (!selectedYear || payment.year === selectedYear)
      );

      const paidWeeks = studentPayments.map(p => p.week);
      const totalPaid = studentPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
      
      return {
        name: student,
        paidWeeks,
        totalPaid,
        weeklyStatus: weeks.map(week => ({
          week,
          paid: paidWeeks.includes(week),
          amount: studentPayments.find(p => p.week === week)?.amount || 0
        }))
      };
    });
  };

  // Get data transaksi terbaru
  const getRecentTransactions = () => {
    return Object.entries(payments)
      .map(([id, payment]) => ({ ...payment, id }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  };

  const stats = getGeneralStats();
  const weeklyData = getWeeklyData();
  const statusData = getPaymentStatusData();
  const studentDetails = getStudentDetails();
  const recentTransactions = getRecentTransactions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data kas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel Monitoring Kas</h1>
          <p className="text-gray-600">Dashboard untuk memantau pembayaran kas kelas secara real-time</p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Tahun
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Tahun</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Bulan
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Bulan</option>
                {months.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Cari Siswa
              </label>
              <input
                type="text"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="Ketik nama siswa..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Kas</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {stats.totalAmount.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Siswa Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.uniqueStudents}/{stats.totalStudents}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Periode</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedMonth || 'Semua'} {selectedYear}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pembayaran per Minggu</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'total' ? `Rp ${value.toLocaleString('id-ID')}` : value,
                    name === 'total' ? 'Total Kas' : 'Jumlah Transaksi'
                  ]}
                />
                <Bar dataKey="jumlah" fill="#3B82F6" name="jumlah" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Pembayaran</h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Transaksi']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Pilih bulan dan tahun untuk melihat status
              </div>
            )}
            {statusData.length > 0 && (
              <div className="flex justify-center space-x-4 mt-4">
                {statusData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Student Details Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Pembayaran Siswa</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-sm font-medium text-gray-600">Nama Siswa</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Minggu 1</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Minggu 2</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Minggu 3</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Minggu 4</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {studentDetails.map((student) => (
                  <tr key={student.name} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">{student.name}</td>
                    {student.weeklyStatus.map((week) => (
                      <td key={week.week} className="py-3">
                        <div className="flex items-center">
                          {week.paid ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              <span className="text-xs">
                                Rp {week.amount.toLocaleString('id-ID')}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-500">
                              <XCircle className="w-4 h-4 mr-1" />
                              <span className="text-xs">Belum</span>
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                    <td className="py-3 font-semibold text-gray-900">
                      Rp {student.totalPaid.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaksi Terbaru</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.student}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.week} - {transaction.month} {transaction.year}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    Rp {transaction.amount.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.timestamp).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Belum ada transaksi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KasMonitoring;

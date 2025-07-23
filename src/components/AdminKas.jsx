import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Calendar, User, FileText, BarChart2, Trash2, Edit3, Plus, Filter } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, where, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function AdminKas() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('histori');
  const [kasData, setKasData] = useState([]);
  const [pengeluaranData, setPengeluaranData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [totalKas, setTotalKas] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterWeek, setFilterWeek] = useState('all');

  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const weeks = ['all', '1', '2', '3', '4'];

  // Format price to IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Realtime listeners for kas and pengeluaran data
  useEffect(() => {
    setIsLoading(true);
    
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = monthNames[selectedMonth - 1];
    
    // Base query for kas
    let kasQuery = query(
      collection(db, 'kas'),
      where('month', '==', monthName),
      where('year', '==', selectedYear),
      orderBy('date', 'desc')
    );

    // Add week filter if not 'all'
    if (filterWeek !== 'all') {
      kasQuery = query(kasQuery, where('week', '==', filterWeek));
    }
    
    const unsubscribeKas = onSnapshot(kasQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || null
      }));
      
      setKasData(data);
      
      // Calculate total kas
      const kasTotal = data.reduce((sum, item) => sum + (item.amount || 0), 0);
      setTotalKas(kasTotal);
      
      // Get pengeluaran data
      const pengeluaranQuery = query(
        collection(db, 'pengeluaran'),
        where('month', '==', monthName),
        where('year', '==', selectedYear),
        orderBy('date', 'desc')
      );
      
      const unsubscribePengeluaran = onSnapshot(pengeluaranQuery, (snapshot) => {
        const pengeluaranData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.() || null
        }));
        
        setPengeluaranData(pengeluaranData);
        
        // Calculate total pengeluaran
        const pengeluaranTotal = pengeluaranData.reduce((sum, item) => sum + (item.amount || 0), 0);
        setTotalPengeluaran(pengeluaranTotal);
        
        // Calculate saldo
        setSaldo(kasTotal - pengeluaranTotal);
        setIsLoading(false);
      }, (error) => {
        console.error("Error loading pengeluaran data:", error);
        setIsLoading(false);
      });
      
      return () => {
        unsubscribePengeluaran();
      };
    }, (error) => {
      console.error("Error loading kas data:", error);
      setIsLoading(false);
    });
    
    return () => {
      unsubscribeKas();
    };
  }, [selectedMonth, selectedYear, filterWeek]);

  // Handle delete kas record
  const handleDeleteKas = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus catatan kas ini?')) return;
    
    try {
      await deleteDoc(doc(db, 'kas', id));
      setPopupMessage('Catatan kas berhasil dihapus!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error deleting kas record:', error);
      setPopupMessage('Gagal menghapus catatan kas!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  // Handle delete pengeluaran record
  const handleDeletePengeluaran = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus catatan pengeluaran ini?')) return;
    
    try {
      await deleteDoc(doc(db, 'pengeluaran', id));
      setPopupMessage('Catatan pengeluaran berhasil dihapus!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error deleting expense record:', error);
      setPopupMessage('Gagal menghapus catatan pengeluaran!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  // Group kas data by student for rekap tab
  const groupKasByStudent = () => {
    const grouped = {};
    
    kasData.forEach(item => {
      if (!grouped[item.studentName]) {
        grouped[item.studentName] = {
          total: 0,
          payments: []
        };
      }
      grouped[item.studentName].total += item.amount || 0;
      grouped[item.studentName].payments.push(item);
    });
    
    return grouped;
  };

  // Filter pengeluaran by category
  const groupPengeluaranByCategory = () => {
    const grouped = {};
    
    pengeluaranData.forEach(item => {
      const category = item.category || 'Lainnya';
      if (!grouped[category]) {
        grouped[category] = {
          total: 0,
          items: []
        };
      }
      grouped[category].total += item.amount || 0;
      grouped[category].items.push(item);
    });
    
    return grouped;
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>

      <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-400 hover:text-white mr-8 transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-light tracking-wider bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
                Admin Kas Kelas
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mt-4 mb-2"></div>
              <p className="text-gray-400 font-light">Kelola dan pantau keuangan kelas</p>
            </div>
          </div>
        </div>

        {/* Month/Year/Week Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
              Bulan
            </label>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full bg-black/50 border border-white/20 px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 transition-all duration-300 appearance-none"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
              <Calendar className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
              Tahun
            </label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full bg-black/50 border border-white/20 px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 transition-all duration-300 appearance-none"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <Calendar className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
              Minggu
            </label>
            <div className="relative">
              <select
                value={filterWeek}
                onChange={(e) => setFilterWeek(e.target.value)}
                className="w-full bg-black/50 border border-white/20 px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 transition-all duration-300 appearance-none"
              >
                {weeks.map(week => (
                  <option key={week} value={week}>
                    {week === 'all' ? 'Semua Minggu' : `Minggu ${week}`}
                  </option>
                ))}
              </select>
              <Filter className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Kas */}
          <div className="border border-white/10 p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-500/20 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Kas</p>
                <p className="text-2xl font-bold">
                  {isLoading ? 'Memuat...' : formatPrice(totalKas)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Pengeluaran */}
          <div className="border border-white/10 p-6 rounded-lg bg-gradient-to-br from-red-600/20 to-orange-500/20 backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Pengeluaran</p>
                <p className="text-2xl font-bold">
                  {isLoading ? 'Memuat...' : formatPrice(totalPengeluaran)}
                </p>
              </div>
            </div>
          </div>

          {/* Saldo */}
          <div className="border border-white/10 p-6 rounded-lg bg-gradient-to-br from-green-600/20 to-teal-500/20 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Saldo Tersedia</p>
                <p className="text-2xl font-bold">
                  {isLoading ? 'Memuat...' : formatPrice(saldo)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            onClick={() => setActiveTab('histori')}
            className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${activeTab === 'histori' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Histori Transaksi
            </div>
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${activeTab === 'rekap' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center">
              <BarChart2 className="w-4 h-4 mr-2" />
              Rekap Siswa
            </div>
          </button>
          <button
            onClick={() => setActiveTab('pengeluaran')}
            className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${activeTab === 'pengeluaran' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Kategori Pengeluaran
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          {/* Histori Tab */}
          {activeTab === 'histori' && (
            <div className="divide-y divide-white/10">
              {/* Kas Masuk */}
              <div>
                <div className="p-4 bg-white/5 border-b border-white/10">
                  <h3 className="text-lg font-medium text-green-400 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Kas Masuk
                  </h3>
                </div>
                
                {isLoading ? (
                  <div className="p-8 text-center text-gray-400">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    Memuat data kas...
                  </div>
                ) : kasData.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    Tidak ada catatan kas untuk periode yang dipilih
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {kasData.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-white/5 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{item.studentName}</h4>
                            <p className="text-sm text-gray-400">
                              {item.note || 'Tidak ada catatan'} • Minggu {item.week}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(item.date)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-green-400 font-medium">
                              {formatPrice(item.amount)}
                            </span>
                            <button
                              onClick={() => handleDeleteKas(item.id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                              title="Hapus catatan"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Pengeluaran */}
              <div>
                <div className="p-4 bg-white/5 border-b border-white/10">
                  <h3 className="text-lg font-medium text-red-400 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pengeluaran
                  </h3>
                </div>
                
                {isLoading ? (
                  <div className="p-8 text-center text-gray-400">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    Memuat data pengeluaran...
                  </div>
                ) : pengeluaranData.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    Tidak ada catatan pengeluaran untuk periode yang dipilih
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {pengeluaranData.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-white/5 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{item.description || 'Tidak ada deskripsi'}</h4>
                            <p className="text-sm text-gray-400">
                              {item.category || 'Tidak ada kategori'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(item.date)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-red-400 font-medium">
                              {formatPrice(item.amount)}
                            </span>
                            <button
                              onClick={() => handleDeletePengeluaran(item.id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                              title="Hapus catatan"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Rekap Tab */}
          {activeTab === 'rekap' && (
            <div>
              <div className="p-4 bg-white/5 border-b border-white/10">
                <h3 className="text-lg font-medium flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-400" />
                  Rekap Pembayaran Siswa
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {months[selectedMonth - 1].label} {selectedYear} • {filterWeek === 'all' ? 'Semua Minggu' : `Minggu ${filterWeek}`}
                </p>
              </div>
              
              {isLoading ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  Memuat data siswa...
                </div>
              ) : kasData.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  Tidak ada catatan pembayaran untuk periode yang dipilih
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {Object.entries(groupKasByStudent()).map(([studentName, data]) => (
                    <div key={studentName} className="p-4 hover:bg-white/5 transition-all duration-300">
                      <div className="flex items-center justify-between cursor-pointer">
                        <div>
                          <h4 className="font-medium">{studentName}</h4>
                          <p className="text-sm text-gray-400">
                            {data.payments.length} pembayaran
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(data.total)}</p>
                          <p className="text-xs text-gray-500">
                            Terakhir: {data.payments[0]?.date ? formatDate(data.payments[0].date) : '-'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Payment details */}
                      <div className="mt-3 pl-4 border-l border-white/10">
                        {data.payments.map((payment) => (
                          <div key={payment.id} className="py-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                {formatDate(payment.date)} • Minggu {payment.week}
                              </span>
                              <span className="text-green-400">
                                {formatPrice(payment.amount)}
                              </span>
                            </div>
                            {payment.note && (
                              <p className="text-gray-500 text-xs mt-1">
                                Catatan: {payment.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pengeluaran by Category Tab */}
          {activeTab === 'pengeluaran' && (
            <div>
              <div className="p-4 bg-white/5 border-b border-white/10">
                <h3 className="text-lg font-medium flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-red-400" />
                  Pengeluaran per Kategori
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {months[selectedMonth - 1].label} {selectedYear}
                </p>
              </div>
              
              {isLoading ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  Memuat data pengeluaran...
                </div>
              ) : pengeluaranData.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  Tidak ada catatan pengeluaran untuk periode yang dipilih
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {Object.entries(groupPengeluaranByCategory()).map(([category, data]) => (
                    <div key={category} className="p-4 hover:bg-white/5 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{category}</h4>
                          <p className="text-sm text-gray-400">
                            {data.items.length} transaksi
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-400">{formatPrice(data.total)}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round((data.total / totalPengeluaran) * 100)}% dari total
                          </p>
                        </div>
                      </div>
                      
                      {/* Expense details */}
                      <div className="mt-3 pl-4 border-l border-white/10">
                        {data.items.map((item) => (
                          <div key={item.id} className="py-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                {formatDate(item.date)} • {item.description || 'Tanpa deskripsi'}
                              </span>
                              <span className="text-red-400">
                                {formatPrice(item.amount)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

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

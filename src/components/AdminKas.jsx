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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    setIsLoading(true);
    
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = monthNames[selectedMonth - 1];
    
    // Base query without filters first for debugging
    let kasQuery = query(collection(db, 'kas'), orderBy('timestamp', 'desc'));

    // Apply filters only if not 'all'
    if (filterWeek !== 'all' || selectedMonth || selectedYear) {
      const queryConditions = [];
      
      if (selectedMonth) queryConditions.push(where('month', '==', monthName));
      if (selectedYear) queryConditions.push(where('year', '==', selectedYear));
      if (filterWeek !== 'all') queryConditions.push(where('week', '==', filterWeek));
      
      kasQuery = query(collection(db, 'kas'), ...queryConditions, orderBy('timestamp', 'desc'));
    }

    console.log("Executing query with filters:", {
      month: monthName,
      year: selectedYear,
      week: filterWeek
    });

    const unsubscribeKas = onSnapshot(kasQuery, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.() || null
        }));
        
        console.log("Fetched kas data:", data);
        setKasData(data);
        
        const kasTotal = data.reduce((sum, item) => sum + (item.amount || 0), 0);
        setTotalKas(kasTotal);
        
        const pengeluaranQuery = query(
          collection(db, 'pengeluaran'),
          where('month', '==', monthName),
          where('year', '==', selectedYear),
          orderBy('date', 'desc')
        );
        
        const unsubscribePengeluaran = onSnapshot(pengeluaranQuery, 
          (snapshot) => {
            const pengeluaranData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              date: doc.data().date?.toDate?.() || null
            }));
            
            setPengeluaranData(pengeluaranData);
            
            const pengeluaranTotal = pengeluaranData.reduce((sum, item) => sum + (item.amount || 0), 0);
            setTotalPengeluaran(pengeluaranTotal);
            setSaldo(kasTotal - pengeluaranTotal);
            setIsLoading(false);
          },
          (error) => {
            console.error("Error loading pengeluaran:", error);
            setIsLoading(false);
          }
        );
        
        return unsubscribePengeluaran;
      },
      (error) => {
        console.error("Error loading kas data:", error);
        if (error.code === 'failed-precondition') {
          setPopupMessage('Missing Firestore index. Please create composite index.');
          setShowPopup(true);
        }
        setIsLoading(false);
      }
    );
    
    return () => unsubscribeKas();
  }, [selectedMonth, selectedYear, filterWeek]);

  const handleDeleteKas = async (id) => {
    if (!window.confirm('Delete this kas record?')) return;
    
    try {
      await deleteDoc(doc(db, 'kas', id));
      setPopupMessage('Kas record deleted!');
    } catch (error) {
      console.error('Delete error:', error);
      setPopupMessage('Failed to delete!');
    }
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleDeletePengeluaran = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    
    try {
      await deleteDoc(doc(db, 'pengeluaran', id));
      setPopupMessage('Expense deleted!');
    } catch (error) {
      console.error('Delete error:', error);
      setPopupMessage('Failed to delete!');
    }
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const groupKasByStudent = () => {
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

  const groupPengeluaranByCategory = () => {
    const grouped = {};
    pengeluaranData.forEach(item => {
      const category = item.category || 'Lainnya';
      if (!grouped[category]) {
        grouped[category] = { total: 0, items: [] };
      }
      grouped[category].total += item.amount || 0;
      grouped[category].items.push(item);
    });
    return grouped;
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>

      <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
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
                Admin Kas Kelas
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mt-4 mb-2"></div>
              <p className="text-gray-400 font-light">Manage class finances</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full bg-black/50 border border-white/20 px-4 py-2 rounded-lg"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full bg-black/50 border border-white/20 px-4 py-2 rounded-lg"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
              Week
            </label>
            <select
              value={filterWeek}
              onChange={(e) => setFilterWeek(e.target.value)}
              className="w-full bg-black/50 border border-white/20 px-4 py-2 rounded-lg"
            >
              {weeks.map(week => (
                <option key={week} value={week}>
                  {week === 'all' ? 'All Weeks' : `Week ${week}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-white/10 p-6 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Kas</p>
                <p className="text-2xl font-bold">
                  {isLoading ? 'Loading...' : formatPrice(totalKas)}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-white/10 p-6 rounded-lg bg-gradient-to-br from-red-600/20 to-orange-500/20 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Expenses</p>
                <p className="text-2xl font-bold">
                  {isLoading ? 'Loading...' : formatPrice(totalPengeluaran)}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-white/10 p-6 rounded-lg bg-gradient-to-br from-green-600/20 to-teal-500/20 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Balance</p>
                <p className="text-2xl font-bold">
                  {isLoading ? 'Loading...' : formatPrice(saldo)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex border-b border-white/10 mb-8">
          <button
            onClick={() => setActiveTab('histori')}
            className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${activeTab === 'histori' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Transaction History
            </div>
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${activeTab === 'rekap' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center">
              <BarChart2 className="w-4 h-4 mr-2" />
              Student Summary
            </div>
          </button>
          <button
            onClick={() => setActiveTab('pengeluaran')}
            className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${activeTab === 'pengeluaran' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Expense Categories
            </div>
          </button>
        </div>

        <div className="border border-white/10 rounded-lg overflow-hidden">
          {activeTab === 'histori' && (
            <div className="divide-y divide-white/10">
              <div>
                <div className="p-4 bg-white/5 border-b border-white/10">
                  <h3 className="text-lg font-medium text-green-400 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Kas Masuk
                  </h3>
                </div>
                
                {isLoading ? (
                  <div className="p-8 text-center text-gray-400">
                    Loading kas data...
                  </div>
                ) : kasData.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No kas records found
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {kasData.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-white/5 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{item.studentName}</h4>
                            <p className="text-sm text-gray-400">
                              {item.note || 'No note'} • Week {item.week}
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
                              title="Delete record"
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
              
              <div>
                <div className="p-4 bg-white/5 border-b border-white/10">
                  <h3 className="text-lg font-medium text-red-400 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Expenses
                  </h3>
                </div>
                
                {isLoading ? (
                  <div className="p-8 text-center text-gray-400">
                    Loading expense data...
                  </div>
                ) : pengeluaranData.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No expense records found
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {pengeluaranData.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-white/5 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{item.description || 'No description'}</h4>
                            <p className="text-sm text-gray-400">
                              {item.category || 'No category'}
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
                              title="Delete record"
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
          
          {activeTab === 'rekap' && (
            <div>
              <div className="p-4 bg-white/5 border-b border-white/10">
                <h3 className="text-lg font-medium flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-400" />
                  Student Payments Summary
                </h3>
              </div>
              
              {isLoading ? (
                <div className="p-8 text-center text-gray-400">
                  Loading student data...
                </div>
              ) : kasData.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No payment records found
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {Object.entries(groupKasByStudent()).map(([studentName, data]) => (
                    <div key={studentName} className="p-4 hover:bg-white/5 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{studentName}</h4>
                          <p className="text-sm text-gray-400">
                            {data.payments.length} payments
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(data.total)}</p>
                          <p className="text-xs text-gray-500">
                            Last: {data.payments[0]?.date ? formatDate(data.payments[0].date) : '-'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pl-4 border-l border-white/10">
                        {data.payments.map((payment) => (
                          <div key={payment.id} className="py-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                {formatDate(payment.date)} • Week {payment.week}
                              </span>
                              <span className="text-green-400">
                                {formatPrice(payment.amount)}
                              </span>
                            </div>
                            {payment.note && (
                              <p className="text-gray-500 text-xs mt-1">
                                Note: {payment.note}
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

          {activeTab === 'pengeluaran' && (
            <div>
              <div className="p-4 bg-white/5 border-b border-white/10">
                <h3 className="text-lg font-medium flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-red-400" />
                  Expenses by Category
                </h3>
              </div>
              
              {isLoading ? (
                <div className="p-8 text-center text-gray-400">
                  Loading expense data...
                </div>
              ) : pengeluaranData.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No expense records found
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {Object.entries(groupPengeluaranByCategory()).map(([category, data]) => (
                    <div key={category} className="p-4 hover:bg-white/5 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{category}</h4>
                          <p className="text-sm text-gray-400">
                            {data.items.length} transactions
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-400">{formatPrice(data.total)}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round((data.total / totalPengeluaran) * 100)}% of total
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pl-4 border-l border-white/10">
                        {data.items.map((item) => (
                          <div key={item.id} className="py-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                {formatDate(item.date)} • {item.description || 'No description'}
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

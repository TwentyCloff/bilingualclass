import React, { useState, useEffect } from 'react';
import { Gift, Cake, ChevronDown, ArrowLeft, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Birthday() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [todayBirthdays, setTodayBirthdays] = useState([]);
  const navigate = useNavigate();

  // Complete student data
  const students = [
    { name: "Alicia", birthday: "30-12-2009" },
    { name: "Aurelia", birthday: "17-05-2009" },
    { name: "Chalisa", birthday: "27-06-2009" },
    { name: "Dahlia", birthday: "15-08-2009" },
    { name: "Danu", birthday: "18-07-2009" },
    { name: "Dara", birthday: "29-10-2009" },
    { name: "Fairuz", birthday: "23-11-2009" },
    { name: "Falan", birthday: "" },
    { name: "Fathul", birthday: "13-04-2008" },
    { name: "Firly", birthday: "06-01-2010" },
    { name: "Fredy", birthday: "22-07-2009" },
    { name: "Hayyu", birthday: "03-09-2009" },
    { name: "Jessica", birthday: "" },
    { name: "Kalinda", birthday: "19-03-2009" },
    { name: "Kania", birthday: "12-12-2009" },
    { name: "Keisha", birthday: "25-09-2008" },
    { name: "Kenzo", birthday: "" },
    { name: "Laras", birthday: "18-03-2009" },
    { name: "Lukas", birthday: "12-07-2009" },
    { name: "Fakhar", birthday: "07-04-2009" },
    { name: "Fiqry", birthday: "06-04-2009" },
    { name: "Firza", birthday: "" },
    { name: "Nadine", birthday: "16-11-2009" },
    { name: "Nazwa", birthday: "" },
    { name: "Quinsha", birthday: "" },
    { name: "Mecca", birthday: "09-05-2009" },
    { name: "Aisy", birthday: "30-03-2009" },
    { name: "Salsabiela", birthday: "26-04-2009" },
    { name: "Sandi", birthday: "14-09-2008" },
    { name: "Shabrina", birthday: "23-01-2009" },
    { name: "Shafira", birthday: "07-01-2009" },
    { name: "Humaira", birthday: "13-06-2009" },
    { name: "Tiara", birthday: "27-03-2009" },
    { name: "Utin", birthday: "28-07-2009" },
    { name: "Willy", birthday: "13-12-2009" }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Check for birthdays today
    const today = new Date();
    const todayFormatted = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const birthdaysToday = students.filter(student => {
      if (!student.birthday) return false;
      const [day, month] = student.birthday.split('-');
      return `${day}-${month}` === todayFormatted;
    });
    
    setTodayBirthdays(birthdaysToday);
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format birthday date
  const formatBirthday = (birthday) => {
    if (!birthday) return "Belum diatur";
    const [day, month, year] = birthday.split('-');
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
  };

  // Calculate age
  const calculateAge = (birthday) => {
    if (!birthday) return "-";
    const today = new Date();
    const birthDate = new Date(`${birthday.split('-').reverse().join('-')}`);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>

      {/* Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className={`flex items-center text-gray-400 hover:text-white mb-8 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Header Section */}
        <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4">Ulang Tahun</h1>
          <div className="w-24 h-px bg-white mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-lg mx-auto">
            Daftar ulang tahun siswa XI-A Bilingual
          </p>
        </div>

        {/* Today's Birthdays Special Section */}
        {todayBirthdays.length > 0 && (
          <div className={`mb-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-6 transform transition-all duration-1000 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 mr-3 text-pink-400" />
              <h2 className="text-2xl font-light text-center">Selamat Ulang Tahun!</h2>
              <Gift className="w-8 h-8 ml-3 text-pink-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayBirthdays.map((student, index) => (
                <div key={index} className="bg-black/30 p-4 rounded-lg border border-white/10 flex items-center">
                  <div className="bg-pink-500/20 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    <Cake className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light">{student.name}</h3>
                    <p className="text-sm text-gray-300">
                      Berusia {calculateAge(student.birthday)} tahun hari ini! 🎉
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className={`mb-8 transform transition-all duration-1000 delay-${todayBirthdays.length > 0 ? '200' : '100'} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari siswa..."
              className="w-full bg-black border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 transition-all pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <User className="absolute left-3 top-3.5 w-4 h-4 text-white/50" />
          </div>
        </div>

        {/* Upcoming Birthdays */}
        <div className={`mb-4 flex items-center text-gray-400 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <Calendar className="w-5 h-5 mr-2" />
          <span>Daftar Ulang Tahun Siswa</span>
        </div>

        {/* Students List */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {filteredStudents.length > 0 ? (
            filteredStudents
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((student, index) => {
                const isTodayBirthday = todayBirthdays.some(s => s.name === student.name);
                
                return (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 transition-all group ${
                      isTodayBirthday 
                        ? 'border-pink-500/50 bg-pink-500/10' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`text-lg font-light mb-1 ${
                          isTodayBirthday ? 'text-pink-300' : 'text-white'
                        }`}>
                          {student.name}
                          {isTodayBirthday && (
                            <span className="ml-2 text-xs bg-pink-500/30 text-pink-200 px-2 py-0.5 rounded-full">
                              TODAY!
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center text-gray-400 group-hover:text-white transition-colors">
                          <Cake className="w-4 h-4 mr-2" />
                          {student.birthday ? (
                            <>
                              <span>{formatBirthday(student.birthday)}</span>
                              <span className="mx-2">•</span>
                              <span>Usia: {calculateAge(student.birthday)}</span>
                            </>
                          ) : (
                            <span>Tanggal belum diatur</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="col-span-2 text-center py-12 text-gray-500">
              Tidak ditemukan siswa yang sesuai
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className={`mt-12 text-center text-gray-500 text-sm transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p>Mari rayakan hari spesial bersama!</p>
          <p className="mt-1">© 2025 Kelas XI-A Bilingual</p>
        </div>
      </div>
    </div>
  );
}

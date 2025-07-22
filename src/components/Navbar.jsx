import React, { useState } from 'react';
import { Bell, User, Home, Trophy, X } from 'lucide-react';

export default function Navbar() {
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  const announcements = [
    {
      title: "Ujian Tengah Semester",
      date: "25 Juli 2025",
      content: "Ujian Tengah Semester akan dilaksanakan mulai tanggal 28 Juli - 2 Agustus 2025. Semua siswa diwajibkan hadir tepat waktu."
    },
    {
      title: "English Competition",
      date: "20 Juli 2025", 
      content: "Pendaftaran English Speech Competition dibuka hingga 30 Juli 2025. Mari tunjukkan kemampuan bilingual kalian!"
    },
    {
      title: "Study Group Session",
      date: "22 Juli 2025",
      content: "Sesi belajar kelompok Matematika akan diadakan setiap Selasa dan Kamis pukul 14.00 di ruang kelas."
    }
  ];

  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
    window.history.pushState({}, '', route);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-light tracking-[0.2em] text-white">
                XI-A
              </h1>
            </div>

            {/* Menu Items */}
            <div className="hidden md:flex items-center space-x-12">
              <button 
                onClick={() => handleNavigation('/')}
                className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-300 text-sm uppercase tracking-wider"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/achievement')}
                className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-300 text-sm uppercase tracking-wider"
              >
                <Trophy className="w-4 h-4" />
                <span>Achievement</span>
              </button>

              {/* Announcement Button */}
              <button 
                onClick={() => setShowAnnouncement(true)}
                className="relative text-white/60 hover:text-white transition-colors duration-300"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></span>
              </button>

              {/* Sign In Button */}
              <button 
                onClick={() => handleNavigation('/signin')}
                className="flex items-center space-x-2 border border-white/20 hover:border-white/40 px-6 py-2 text-sm text-white/80 hover:text-white transition-all duration-300 uppercase tracking-wider"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-white/60 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Announcement Popup */}
      {showAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-white/20 rounded-none p-12 m-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-light tracking-[0.2em] text-white flex items-center">
                <Bell className="w-6 h-6 text-white mr-4" />
                Announcements
              </h2>
              <button 
                onClick={() => setShowAnnouncement(false)}
                className="text-white/60 hover:text-white transition-colors duration-300 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-8">
              {announcements.map((announcement, index) => (
                <div key={index} className="border-b border-white/10 pb-8 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-light text-white tracking-wider">{announcement.title}</h3>
                    <span className="text-xs text-white/40 uppercase tracking-widest">
                      {announcement.date}
                    </span>
                  </div>
                  <p className="text-white/60 leading-relaxed font-light">{announcement.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setShowAnnouncement(false)}
                className="border border-white/20 hover:border-white/40 px-8 py-3 text-white/80 hover:text-white font-light transition-all duration-300 uppercase tracking-wider text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
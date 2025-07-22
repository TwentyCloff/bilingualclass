import React, { useState } from 'react';
import { Bell, User, Home, Trophy, X, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const announcements = [
    {
      title: "Main mobel lejen",
      date: "Abad pertama",
      content: "Pus reng bersama Dr.Tirta"
    },
    {
      title: "Classmeet", 
      date: "20 Juli 2025",
      content: "Nak tidok"
    },
    {
      title: "No Ide aokwoakowkaowk",
      date: "abad ke 7",
      content: "Apa yah"
    }
  ];

  const handleNavigation = (route) => {
    navigate(route);
    setMobileMenuOpen(false);
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

            {/* Desktop Menu Items */}
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

            {/* Mobile Menu Buttons */}
            <div className="md:hidden flex items-center space-x-4">
              <button 
                onClick={() => setShowAnnouncement(true)}
                className="relative text-white/60 hover:text-white transition-colors duration-300 p-2"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
              </button>
              
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="text-white/60 hover:text-white transition-colors duration-300 p-2"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h1 className="text-xl font-light tracking-[0.2em] text-white">
                XI-A
              </h1>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/60 hover:text-white transition-colors duration-300 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col space-y-8 p-6">
              <button 
                onClick={() => handleNavigation('/')}
                className="flex items-center space-x-4 text-white/80 hover:text-white transition-colors duration-300 text-lg uppercase tracking-wider py-3"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/achievement')}
                className="flex items-center space-x-4 text-white/80 hover:text-white transition-colors duration-300 text-lg uppercase tracking-wider py-3"
              >
                <Trophy className="w-5 h-5" />
                <span>Achievement</span>
              </button>

              <button 
                onClick={() => handleNavigation('/signin')}
                className="flex items-center space-x-4 text-white/80 hover:text-white transition-colors duration-300 text-lg uppercase tracking-wider py-3"
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Announcement Popup */}
      {showAnnouncement && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-white/20 rounded-none p-6 md:p-12 m-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 md:mb-12">
              <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white flex items-center">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-white mr-3 md:mr-4" />
                Announcements
              </h2>
              <button 
                onClick={() => setShowAnnouncement(false)}
                className="text-white/60 hover:text-white transition-colors duration-300 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              {announcements.map((announcement, index) => (
                <div key={index} className="border-b border-white/10 pb-6 md:pb-8 last:border-b-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4">
                    <h3 className="text-base md:text-lg font-light text-white tracking-wider">{announcement.title}</h3>
                    <span className="text-xs text-white/40 uppercase tracking-widest mt-1 md:mt-0">
                      {announcement.date}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-white/60 leading-relaxed font-light">{announcement.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 md:mt-12 text-center">
              <button 
                onClick={() => setShowAnnouncement(false)}
                className="border border-white/20 hover:border-white/40 px-6 py-2 md:px-8 md:py-3 text-white/80 hover:text-white font-light transition-all duration-300 uppercase tracking-wider text-sm"
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

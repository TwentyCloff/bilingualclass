import React, { useState, useEffect } from 'react';
import { Heart, Instagram, Mail, Clock } from 'lucide-react';

export default function Footer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Hitung waktu sampai kelulusan (2 tahun dari 22 Juli 2025)
    const graduationDate = new Date('2027-04-12T00:00:00'); // Perkiraan tanggal kelulusan
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = graduationDate - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white relative overflow-hidden border-t border-white/10">
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Countdown Section */}
        <div className={`mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-light tracking-wider text-center mb-12">
            Countdown to <span className="text-white/80">Graduation</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="group text-center p-6 border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-light mb-2">{timeLeft.days}</div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Days</p>
            </div>
            
            <div className="group text-center p-6 border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-light mb-2">{timeLeft.hours}</div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Hours</p>
            </div>
            
            <div className="group text-center p-6 border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-light mb-2">{timeLeft.minutes}</div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Minutes</p>
            </div>
            
            <div className="group text-center p-6 border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-light mb-2">{timeLeft.seconds}</div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Seconds</p>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-400 text-sm flex items-center justify-center">
            <Clock className="w-4 h-4 mr-2" />
            Estimated graduation: April 12, 2027
          </div>
        </div>
        
        {/* Footer Content */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* About Section */}
          <div>
            <h3 className="text-xl font-light tracking-wider mb-4">XI-A Bilingual</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              The brightest bilingual class of 2025/2026 academic year, striving for excellence in both academics and character.
            </p>
            <div className="flex items-center text-gray-400 text-sm">
              <Heart className="w-4 h-4 mr-1" />
              <span>Made with love by XI-A students</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-light tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-center">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Class Gallery</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Achievements</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Class Blog</a></li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-xl font-light tracking-wider mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-white/40 transition-all">
                <Instagram className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-white/40 transition-all">
                <Mail className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
              </a>
            </div>
            <p className="text-gray-400 text-sm text-center md:text-right">
              SMAN 10 Pontianak<br />
              Jl. Karya Baru, Gg Karya Tani<br />
              Pontianak, Kalimantan Barat
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className={`mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          © 2025 XI-A Bilingual Class. All memories reserved.
        </div>
      </div>
      
      {/* Bottom Border Elements */}
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Users, Book, Award, ChevronDown } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">


      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Main Title Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-7xl md:text-9xl font-light tracking-[0.2em] mb-4 text-white">
            XI-A
          </h1>
          <div className="w-24 h-px bg-white mx-auto mb-6"></div>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.3em] text-gray-300 uppercase">
            Bilingual Class
          </h2>
        </div>

        {/* Clean Info Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl w-full transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="group text-center">
            <div className="w-16 h-16 mx-auto mb-4 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white/40 transition-all duration-300">
              <Users className="w-7 h-7 text-white/60 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-light mb-2">35</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Students</p>
          </div>

          <div className="group text-center">
            <div className="w-16 h-16 mx-auto mb-4 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white/40 transition-all duration-300">
              <Book className="w-7 h-7 text-white/60 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-light mb-2">Sir Amin S.Pd</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Homeroom Teacher</p>
          </div>

          <div className="group text-center">
            <div className="w-16 h-16 mx-auto mb-4 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white/40 transition-all duration-300">
              <Award className="w-7 h-7 text-white/60 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-light mb-2">2025/2026</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Academic Year</p>
          </div>
        </div>

        {/* Minimalist Description */}
        <div className={`max-w-2xl text-center mb-12 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p className="text-gray-400 leading-relaxed text-lg font-light">
            A community of dedicated learners mastering both Indonesian and English, 
            pursuing academic excellence in our bilingual journey.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-40' : 'opacity-0'}`}>
          <div className="animate-bounce">
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Minimal Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>
    </div>
  );
}
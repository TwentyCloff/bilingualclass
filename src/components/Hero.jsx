import React, { useState, useEffect } from 'react';
import { Users, Book, Award, ChevronDown } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Modern Grid Pattern Background (Subtle) */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Modern Title Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-7xl md:text-9xl font-light tracking-[0.2em] mb-4 text-white">
            <span className="relative">
              XI-A
              <span className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"></span>
            </span>
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent mx-auto mb-6"></div>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.3em] text-gray-300 uppercase">
            <span className="text-white font-medium">BILINGUAL</span> CLASS
          </h2>
        </div>

        {/* Modern Info Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl w-full transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="group text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-black border-2 border-white/10 rounded-full flex items-center justify-center group-hover:border-cyan-400/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80"></div>
              <Users className="w-8 h-8 text-cyan-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-2xl font-light mb-2 text-white group-hover:text-cyan-400 transition-colors duration-300">35</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors duration-300">Students</p>
          </div>

          <div className="group text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-black border-2 border-white/10 rounded-full flex items-center justify-center group-hover:border-purple-400/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80"></div>
              <Book className="w-8 h-8 text-purple-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-lg font-light mb-2 text-white group-hover:text-purple-400 transition-colors duration-300">Sir Amin S.Pd</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors duration-300">Homeroom Teacher</p>
          </div>

          <div className="group text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-black border-2 border-white/10 rounded-full flex items-center justify-center group-hover:border-amber-400/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80"></div>
              <Award className="w-8 h-8 text-amber-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-lg font-light mb-2 text-white group-hover:text-amber-400 transition-colors duration-300">2025/2026</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors duration-300">Academic Year</p>
          </div>
        </div>

        {/* Modern Description */}
        <div className={`max-w-2xl text-center mb-12 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p className="text-gray-300 leading-relaxed text-lg font-light">
            A <span className="text-white font-medium border-b border-white/20 hover:border-cyan-400 transition-colors duration-300">prestigious community</span> of dedicated learners mastering both Indonesian and English, 
            pursuing <span className="text-white font-medium border-b border-white/20 hover:border-purple-400 transition-colors duration-300">academic excellence</span> in our bilingual journey.
          </p>
        </div>

        {/* Modern Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="animate-bounce flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-cyan-400 transition-all duration-300">
              <ChevronDown className="w-5 h-5 text-white group-hover:text-cyan-400 transition-colors duration-300" />
            </div>
            <span className="text-xs text-gray-400 mt-2 tracking-widest group-hover:text-white transition-colors duration-300">EXPLORE</span>
          </div>
        </div>
      </div>

      {/* Modern Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      
      {/* Modern Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8">
        <div className="w-full h-full border-t-2 border-l-2 border-white/20 hover:border-cyan-400 transition-all duration-500"></div>
      </div>
      <div className="absolute top-6 right-6 w-8 h-8">
        <div className="w-full h-full border-t-2 border-r-2 border-white/20 hover:border-purple-400 transition-all duration-500"></div>
      </div>
      <div className="absolute bottom-6 left-6 w-8 h-8">
        <div className="w-full h-full border-b-2 border-l-2 border-white/20 hover:border-amber-400 transition-all duration-500"></div>
      </div>
      <div className="absolute bottom-6 right-6 w-8 h-8">
        <div className="w-full h-full border-b-2 border-r-2 border-white/20 hover:border-white transition-all duration-500"></div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Users, Book, Award, ChevronDown } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-900 rounded-full filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-900 rounded-full filter blur-3xl opacity-10 animate-float-delay"></div>
        <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-cyan-900 rounded-full filter blur-3xl opacity-10 animate-float-delay-2"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Main Title Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-7xl md:text-9xl font-light tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            XI-A
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-6"></div>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.3em] text-gray-300 uppercase">
            Bilingual <span className="text-white font-medium">Excellence</span>
          </h2>
        </div>

        {/* Premium Info Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl w-full transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="group text-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-light mb-2 text-white">35</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Students</p>
          </div>

          <div className="group text-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300">
              <Book className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-light mb-2 text-white">Sir Amin S.Pd</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Homeroom Teacher</p>
          </div>

          <div className="group text-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-300">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-light mb-2 text-white">2025/2026</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider">Academic Year</p>
          </div>
        </div>

        {/* Glossy Description */}
        <div className={`max-w-2xl text-center mb-12 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p className="text-gray-300 leading-relaxed text-lg font-light backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10">
            A <span className="text-white font-medium">prestigious community</span> of dedicated learners mastering both Indonesian and English, 
            pursuing <span className="text-white font-medium">academic excellence</span> in our bilingual journey.
          </p>
        </div>

        {/* Premium Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-80' : 'opacity-0'}`}>
          <div className="animate-bounce flex flex-col items-center">
            <ChevronDown className="w-6 h-6 text-white bg-gradient-to-br from-cyan-400 to-blue-500 p-1 rounded-full shadow-lg shadow-blue-500/30" />
            <span className="text-xs text-gray-400 mt-2 tracking-widest">SCROLL</span>
          </div>
        </div>
      </div>

      {/* Animated Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      
      {/* Premium Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/30 transition-all duration-500 hover:border-white/60"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/30 transition-all duration-500 hover:border-white/60"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/30 transition-all duration-500 hover:border-white/60"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/30 transition-all duration-500 hover:border-white/60"></div>
    </div>
  );
}

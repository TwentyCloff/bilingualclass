import React, { useState, useEffect } from 'react';
import { Users, Book, Award, ChevronDown, Zap, Globe, Terminal } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanlinePosition, setScanlinePosition] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 4000);

    // Scanline animation
    const scanlineInterval = setInterval(() => {
      setScanlinePosition(prev => (prev + 1) % 100);
    }, 50);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(scanlineInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-mono">
      {/* Futuristic Background */}
      <div className="absolute inset-0">
        {/* Digital Grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridPulse 3s ease-in-out infinite'
        }}></div>

        {/* Neon Circuit Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60 animate-pulse delay-500"></div>

        {/* Holographic Shapes */}
        <div className="absolute top-1/6 right-1/6 w-32 h-32 border border-cyan-400/30 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 left-1/8 w-24 h-24 border-2 border-purple-400/20 rounded-full animate-pulse"></div>
        
        {/* Scanning Line */}
        <div 
          className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 transition-all duration-100"
          style={{ top: `${scanlinePosition}%` }}
        ></div>

        {/* Binary Rain Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-xs text-cyan-400/20 animate-pulse"
              style={{
                left: `${i * 5}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Futuristic Title with Glitch Effect */}
        <div className={`text-center mb-24 transform transition-all duration-2000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-4 text-cyan-400/30 text-xs tracking-widest">[INITIALIZING...]</div>
            <h1 className={`text-9xl md:text-[14rem] font-black tracking-[0.3em] mb-6 relative ${glitchActive ? 'animate-pulse' : ''}`}>
              <span className="relative z-10 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                XI-A
              </span>
              {glitchActive && (
                <>
                  <span className="absolute top-0 left-0 text-red-500 opacity-80" style={{ clipPath: 'inset(0 0 90% 0)' }}>XI-A</span>
                  <span className="absolute top-0 left-0 text-blue-500 opacity-80 translate-x-1" style={{ clipPath: 'inset(90% 0 0 0)' }}>XI-A</span>
                </>
              )}
            </h1>
            <div className="absolute -bottom-2 -right-4 text-purple-400/40 text-xs tracking-widest">[ONLINE]</div>
          </div>

          {/* Tech Divider */}
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 bg-cyan-400 ${i === 2 ? 'animate-ping' : 'animate-pulse'}`} style={{ animationDelay: `${i * 200}ms` }}></div>
              ))}
            </div>
            <Terminal className="w-6 h-6 text-cyan-400 animate-pulse" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 bg-purple-400 ${i === 2 ? 'animate-ping' : 'animate-pulse'}`} style={{ animationDelay: `${i * 200}ms` }}></div>
              ))}
            </div>
          </div>

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.5em] text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text uppercase">
              <Globe className="inline w-8 h-8 mr-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              Bilingual.exe
            </h2>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-cyan-400/60 text-xs tracking-widest animate-pulse">
              {'>'} SYSTEM READY
            </div>
          </div>
        </div>

        {/* Cyberpunk Data Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-7xl w-full transform transition-all duration-2000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
          {/* Students Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/80 border-2 border-cyan-400/30 rounded-lg p-8 backdrop-blur-sm transition-all duration-500 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-400/20">
              <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="text-cyan-400/60 text-xs mb-4 tracking-widest">[DATA_NODE_01]</div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 border-2 border-cyan-400/50 rounded-full flex items-center justify-center relative group-hover:rotate-180 transition-transform duration-700">
                  <Users className="w-10 h-10 text-cyan-400" />
                  <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-5xl font-black mb-2 text-transparent bg-gradient-to-r from-cyan-400 to-white bg-clip-text">35</h3>
                <p className="text-cyan-400/80 text-sm tracking-[0.3em] uppercase">STUDENTS</p>
                <div className="mt-4 text-xs text-cyan-400/40 font-mono">{'>'} ACTIVE_USERS</div>
              </div>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/80 border-2 border-purple-400/30 rounded-lg p-8 backdrop-blur-sm transition-all duration-500 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-400/20">
              <div className="absolute top-2 right-2 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
              <div className="text-purple-400/60 text-xs mb-4 tracking-widest">[ADMIN_ACCESS]</div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 border-2 border-purple-400/50 rounded-full flex items-center justify-center relative group-hover:rotate-180 transition-transform duration-700">
                  <Book className="w-10 h-10 text-purple-400" />
                  <div className="absolute inset-0 border-2 border-purple-400/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-transparent bg-gradient-to-r from-purple-400 to-white bg-clip-text">Sir Amin S.Pd</h3>
                <p className="text-purple-400/80 text-sm tracking-[0.3em] uppercase">ROOT_ADMIN</p>
                <div className="mt-4 text-xs text-purple-400/40 font-mono">{'>'} HOMEROOM_TEACHER</div>
              </div>
            </div>
          </div>

          {/* Academic Year Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/80 border-2 border-blue-400/30 rounded-lg p-8 backdrop-blur-sm transition-all duration-500 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-400/20">
              <div className="absolute top-2 right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
              <div className="text-blue-400/60 text-xs mb-4 tracking-widest">[TIME_STAMP]</div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 border-2 border-blue-400/50 rounded-full flex items-center justify-center relative group-hover:rotate-180 transition-transform duration-700">
                  <Award className="w-10 h-10 text-blue-400" />
                  <div className="absolute inset-0 border-2 border-blue-400/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-transparent bg-gradient-to-r from-blue-400 to-white bg-clip-text">2025/2026</h3>
                <p className="text-blue-400/80 text-sm tracking-[0.3em] uppercase">PROTOCOL_VER</p>
                <div className="mt-4 text-xs text-blue-400/40 font-mono">{'>'} ACADEMIC_CYCLE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cyberpunk Description Terminal */}
        <div className={`max-w-4xl w-full mb-20 transform transition-all duration-2000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
          <div className="relative bg-black/90 border-2 border-cyan-400/30 rounded-lg overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-gray-900/80 px-6 py-3 border-b border-cyan-400/30 flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-cyan-400/80 text-sm font-mono">neural_network://xi-a.class/description.exe</div>
            </div>
            
            {/* Terminal Content */}
            <div className="p-8">
              <div className="text-cyan-400/60 text-sm mb-4 font-mono">{'>'} executing class_description.exe...</div>
              <p className="text-gray-200 leading-relaxed text-lg mb-4">
                <span className="text-cyan-400">{'>'}</span> A community of{' '}
                <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold">enhanced learners</span>{' '}
                mastering dual-language protocols, pursuing{' '}
                <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text font-bold">maximum academic efficiency</span>{' '}
                in our bilingual neural network.
              </p>
              <div className="text-cyan-400/40 text-sm font-mono animate-pulse">{'>'} process_complete | status: optimal_performance</div>
            </div>
          </div>
        </div>

        {/* Futuristic Scroll Indicator */}
        <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 transition-all duration-2000 delay-1500 ${isVisible ? 'opacity-80' : 'opacity-0'}`}>
          <div className="flex flex-col items-center">
            <div className="text-cyan-400/60 text-xs mb-2 tracking-widest">SCROLL_DOWN</div>
            <div className="w-8 h-14 border-2 border-cyan-400/40 rounded-full relative">
              <div className="w-2 h-4 bg-gradient-to-b from-cyan-400 to-transparent rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-bounce"></div>
            </div>
            <Zap className="w-5 h-5 text-cyan-400/60 mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Futuristic Frame */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-16 h-16">
          <div className="absolute top-0 left-0 w-8 h-2 bg-cyan-400/60"></div>
          <div className="absolute top-0 left-0 w-2 h-8 bg-cyan-400/60"></div>
        </div>
        <div className="absolute top-4 right-4 w-16 h-16">
          <div className="absolute top-0 right-0 w-8 h-2 bg-cyan-400/60"></div>
          <div className="absolute top-0 right-0 w-2 h-8 bg-cyan-400/60"></div>
        </div>
        <div className="absolute bottom-4 left-4 w-16 h-16">
          <div className="absolute bottom-0 left-0 w-8 h-2 bg-purple-400/60"></div>
          <div className="absolute bottom-0 left-0 w-2 h-8 bg-purple-400/60"></div>
        </div>
        <div className="absolute bottom-4 right-4 w-16 h-16">
          <div className="absolute bottom-0 right-0 w-8 h-2 bg-purple-400/60"></div>
          <div className="absolute bottom-0 right-0 w-2 h-8 bg-purple-400/60"></div>
        </div>
      </div>

      {/* HUD Elements */}
      <div className="absolute top-6 left-6 text-cyan-400/40 text-xs font-mono">
        <div>XI-A_INTERFACE_v2.5</div>
        <div className="mt-1">STATUS: <span className="text-green-400">ONLINE</span></div>
      </div>
      
      <div className="absolute top-6 right-6 text-purple-400/40 text-xs font-mono text-right">
        <div>NEURAL_LINK_ACTIVE</div>
        <div className="mt-1">CONN: <span className="text-green-400 animate-pulse">●</span></div>
      </div>

      <style jsx>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

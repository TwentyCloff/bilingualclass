import React, { useState, useEffect, useRef } from 'react';
import { Users, Book, Award, ChevronDown, Zap, Globe, Terminal } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanlinePosition, setScanlinePosition] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [currentTypingPhase, setCurrentTypingPhase] = useState('question');
  const [isTyping, setIsTyping] = useState(true);
  const chatContainerRef = useRef(null);

  const chatMessages = [
    {
      question: "What is SMAN 10 Pontianak?",
      answer: "SMAN 10 Pontianak is one of the most innovative high schools in West Kalimantan! We're known for our digital-forward approach to education and our vibrant bilingual program. Think of us as a launchpad for future leaders and tech-savvy innovators. Pretty cool, right? 😎"
    },
    {
      question: "Is this a digital-based school?",
      answer: "Absolutely! We're all about digital here. From smart classrooms to online learning platforms, we've got the tech to make learning engaging and effective. Our teachers are tech-whizzes too – they'll have you coding, designing, and creating in no time! 💻✨"
    },
    {
      question: "Does this school support student talents?",
      answer: "Oh, you bet! Whether you're into robotics, arts, sports, or coding, we've got programs to help you shine. Our extracurricular lineup is like a talent buffet – pick what excites you! We've even had students compete nationally. Your talent? Consider it nurtured here! 🎨🤖🏆"
    },
    {
      question: "Does this school have bilingual classes?",
      answer: "You're looking at one right now! XI-A is our flagship bilingual class where subjects are taught in both English and Indonesian. It's not just about language – it's about thinking globally. Plus, it makes you sound super impressive at international events! 🌍🗣️"
    },
    {
      question: "What makes SMAN 10 special?",
      answer: "Where do I start? It's the energy! Between our cutting-edge facilities, passionate teachers, and students who are always pushing boundaries – there's this buzz of creativity everywhere. It's not just school; it's where future-ready minds are built. Come see for yourself! 🚀"
    }
  ];

  // Typing animation effect
  useEffect(() => {
    let currentText = '';
    let currentIndex = 0;
    let typingSpeed = 30; // Faster typing speed
    let deletingSpeed = 15; // Faster deleting speed
    let pauseDuration = 1500; // Pause between messages

    const typeText = () => {
      const message = currentTypingPhase === 'question' 
        ? chatMessages[currentMessageIndex].question 
        : chatMessages[currentMessageIndex].answer;

      if (currentIndex < message.length) {
        currentText = message.substring(0, currentIndex + 1);
        setDisplayText(currentText);
        currentIndex++;
        setTimeout(typeText, typingSpeed + (Math.random() * 20)); // Slight randomness to typing
      } else {
        if (currentTypingPhase === 'question') {
          setTimeout(() => {
            setCurrentTypingPhase('answer');
            currentText = '';
            currentIndex = 0;
            typeText();
          }, 500); // Short pause before answer
        } else {
          setIsTyping(false);
          setTimeout(() => {
            setIsTyping(true);
            setCurrentTypingPhase('question');
            setCurrentMessageIndex((prev) => (prev + 1) % chatMessages.length);
            currentText = '';
            currentIndex = 0;
          }, pauseDuration);
        }
      }
    };

    if (isTyping) {
      typeText();
    }

    return () => {
      currentText = '';
      currentIndex = 0;
    };
  }, [currentMessageIndex, currentTypingPhase, isTyping]);

  // Auto-scroll chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [displayText]);

  // Other effects (glitch, scanline)
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6 py-12 md:py-20">
        {/* Futuristic Title with Glitch Effect */}
        <div className={`text-center mb-12 md:mb-24 transform transition-all duration-2000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
          <div className="relative mb-6 md:mb-8">
            <div className="absolute -top-4 -left-4 text-cyan-400/30 text-xs tracking-widest">[INITIALIZING...]</div>
            <h1 className={`text-6xl md:text-9xl lg:text-[14rem] font-black tracking-[0.3em] mb-4 md:mb-6 relative ${glitchActive ? 'animate-pulse' : ''}`}>
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
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-6 md:mb-10">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 bg-cyan-400 ${i === 2 ? 'animate-ping' : 'animate-pulse'}`} style={{ animationDelay: `${i * 200}ms` }}></div>
              ))}
            </div>
            <Terminal className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 animate-pulse" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 bg-purple-400 ${i === 2 ? 'animate-ping' : 'animate-pulse'}`} style={{ animationDelay: `${i * 200}ms` }}></div>
              ))}
            </div>
          </div>

          <div className="relative">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-light tracking-[0.5em] text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text uppercase">
              <Globe className="inline w-5 h-5 md:w-8 md:h-8 mr-2 md:mr-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              Bilingual.exe
            </h2>
            <div className="absolute -bottom-4 md:-bottom-6 left-1/2 transform -translate-x-1/2 text-cyan-400/60 text-xs tracking-widest animate-pulse">
              {'>'} SYSTEM READY
            </div>
          </div>
        </div>

        {/* AI Chat Browser Card */}
        <div className={`w-full max-w-4xl mb-12 md:mb-20 transform transition-all duration-2000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
          <div className="relative bg-black/90 border-2 border-purple-400/30 rounded-lg overflow-hidden">
            {/* Browser Header */}
            <div className="bg-gray-900/80 px-4 py-2 md:px-6 md:py-3 border-b border-purple-400/30 flex items-center gap-2 md:gap-4">
              <div className="flex gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-purple-400/80 text-xs md:text-sm font-mono truncate">neural_network://xi-a.class/chat_interface</div>
            </div>
            
            {/* Chat Content */}
            <div 
              ref={chatContainerRef}
              className="p-4 md:p-6 h-48 md:h-64 overflow-y-auto custom-scrollbar"
            >
              <div className="mb-4">
                <div className="text-purple-400 text-sm md:text-base font-mono mb-2">
                  <span className="text-green-400">{'>'}</span> {chatMessages[currentMessageIndex].question}
                </div>
                <div className="text-cyan-300 text-sm md:text-base font-mono">
                  <span className="text-blue-400">{'>>'}</span> {displayText}
                  {isTyping && currentTypingPhase === 'answer' && (
                    <span className="ml-1 inline-block w-2 h-4 bg-cyan-400 animate-blink"></span>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <div className="text-green-400/60 text-xs md:text-sm font-mono">
                  {currentTypingPhase === 'question' ? 'processing_query...' : 'response_complete'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cyberpunk Data Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-24 max-w-7xl w-full transform transition-all duration-2000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
          {/* Students Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/80 border-2 border-cyan-400/30 rounded-lg p-4 md:p-8 backdrop-blur-sm transition-all duration-500 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-400/20">
              <div className="absolute top-2 right-2 w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="text-cyan-400/60 text-xs mb-2 md:mb-4 tracking-widest">[DATA_NODE_01]</div>
              
              <div className="flex items-center justify-center mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-20 md:h-20 border-2 border-cyan-400/50 rounded-full flex items-center justify-center relative group-hover:rotate-180 transition-transform duration-700">
                  <Users className="w-6 h-6 md:w-10 md:h-10 text-cyan-400" />
                  <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-3xl md:text-5xl font-black mb-1 md:mb-2 text-transparent bg-gradient-to-r from-cyan-400 to-white bg-clip-text">35</h3>
                <p className="text-cyan-400/80 text-xs md:text-sm tracking-[0.3em] uppercase">STUDENTS</p>
                <div className="mt-2 md:mt-4 text-xs text-cyan-400/40 font-mono">{'>'} ACTIVE_USERS</div>
              </div>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/80 border-2 border-purple-400/30 rounded-lg p-4 md:p-8 backdrop-blur-sm transition-all duration-500 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-400/20">
              <div className="absolute top-2 right-2 w-2 h-2 md:w-3 md:h-3 bg-purple-400 rounded-full animate-ping"></div>
              <div className="text-purple-400/60 text-xs mb-2 md:mb-4 tracking-widest">[ADMIN_ACCESS]</div>
              
              <div className="flex items-center justify-center mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-20 md:h-20 border-2 border-purple-400/50 rounded-full flex items-center justify-center relative group-hover:rotate-180 transition-transform duration-700">
                  <Book className="w-6 h-6 md:w-10 md:h-10 text-purple-400" />
                  <div className="absolute inset-0 border-2 border-purple-400/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-transparent bg-gradient-to-r from-purple-400 to-white bg-clip-text">Sir Amin S.Pd</h3>
                <p className="text-purple-400/80 text-xs md:text-sm tracking-[0.3em] uppercase">ROOT_ADMIN</p>
                <div className="mt-2 md:mt-4 text-xs text-purple-400/40 font-mono">{'>'} HOMEROOM_TEACHER</div>
              </div>
            </div>
          </div>

          {/* Academic Year Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/80 border-2 border-blue-400/30 rounded-lg p-4 md:p-8 backdrop-blur-sm transition-all duration-500 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-400/20">
              <div className="absolute top-2 right-2 w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full animate-ping"></div>
              <div className="text-blue-400/60 text-xs mb-2 md:mb-4 tracking-widest">[TIME_STAMP]</div>
              
              <div className="flex items-center justify-center mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-20 md:h-20 border-2 border-blue-400/50 rounded-full flex items-center justify-center relative group-hover:rotate-180 transition-transform duration-700">
                  <Award className="w-6 h-6 md:w-10 md:h-10 text-blue-400" />
                  <div className="absolute inset-0 border-2 border-blue-400/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 text-transparent bg-gradient-to-r from-blue-400 to-white bg-clip-text">2025/2026</h3>
                <p className="text-blue-400/80 text-xs md:text-sm tracking-[0.3em] uppercase">PROTOCOL_VER</p>
                <div className="mt-2 md:mt-4 text-xs text-blue-400/40 font-mono">{'>'} ACADEMIC_CYCLE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cyberpunk Description Terminal */}
        <div className={`max-w-4xl w-full mb-12 md:mb-20 transform transition-all duration-2000 delay-1500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
          <div className="relative bg-black/90 border-2 border-cyan-400/30 rounded-lg overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-gray-900/80 px-4 py-2 md:px-6 md:py-3 border-b border-cyan-400/30 flex items-center gap-2 md:gap-4">
              <div className="flex gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-cyan-400/80 text-xs md:text-sm font-mono truncate">neural_network://xi-a.class/description.exe</div>
            </div>
            
            {/* Terminal Content */}
            <div className="p-4 md:p-8">
              <div className="text-cyan-400/60 text-xs md:text-sm mb-2 md:mb-4 font-mono">{'>'} executing class_description.exe...</div>
              <p className="text-gray-200 leading-relaxed text-sm md:text-lg mb-2 md:mb-4">
                <span className="text-cyan-400">{'>'}</span> A community of{' '}
                <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold">enhanced learners</span>{' '}
                mastering dual-language protocols, pursuing{' '}
                <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text font-bold">maximum academic efficiency</span>{' '}
                in our bilingual neural network.
              </p>
              <div className="text-cyan-400/40 text-xs md:text-sm font-mono animate-pulse">{'>'} process_complete | status: optimal_performance</div>
            </div>
          </div>
        </div>

        {/* Futuristic Scroll Indicator */}
        <div className={`absolute bottom-6 md:bottom-12 left-1/2 transform -translate-x-1/2 transition-all duration-2000 delay-2000 ${isVisible ? 'opacity-80' : 'opacity-0'}`}>
          <div className="flex flex-col items-center">
            <div className="text-cyan-400/60 text-xs mb-1 md:mb-2 tracking-widest">SCROLL_DOWN</div>
            <div className="w-6 h-10 md:w-8 md:h-14 border-2 border-cyan-400/40 rounded-full relative">
              <div className="w-1.5 h-3 md:w-2 md:h-4 bg-gradient-to-b from-cyan-400 to-transparent rounded-full absolute top-1 md:top-2 left-1/2 transform -translate-x-1/2 animate-bounce"></div>
            </div>
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-cyan-400/60 mt-1 md:mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Futuristic Frame */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner Brackets */}
        <div className="absolute top-2 md:top-4 left-2 md:left-4 w-8 md:w-16 h-8 md:h-16">
          <div className="absolute top-0 left-0 w-4 md:w-8 h-0.5 md:h-2 bg-cyan-400/60"></div>
          <div className="absolute top-0 left-0 w-0.5 md:w-2 h-4 md:h-8 bg-cyan-400/60"></div>
        </div>
        <div className="absolute top-2 md:top-4 right-2 md:right-4 w-8 md:w-16 h-8 md:h-16">
          <div className="absolute top-0 right-0 w-4 md:w-8 h-0.5 md:h-2 bg-cyan-400/60"></div>
          <div className="absolute top-0 right-0 w-0.5 md:w-2 h-4 md:h-8 bg-cyan-400/60"></div>
        </div>
        <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 w-8 md:w-16 h-8 md:h-16">
          <div className="absolute bottom-0 left-0 w-4 md:w-8 h-0.5 md:h-2 bg-purple-400/60"></div>
          <div className="absolute bottom-0 left-0 w-0.5 md:w-2 h-4 md:h-8 bg-purple-400/60"></div>
        </div>
        <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 w-8 md:w-16 h-8 md:h-16">
          <div className="absolute bottom-0 right-0 w-4 md:w-8 h-0.5 md:h-2 bg-purple-400/60"></div>
          <div className="absolute bottom-0 right-0 w-0.5 md:w-2 h-4 md:h-8 bg-purple-400/60"></div>
        </div>
      </div>

      {/* HUD Elements */}
      <div className="absolute top-2 md:top-6 left-2 md:left-6 text-cyan-400/40 text-xs font-mono">
        <div>XI-A_INTERFACE_v2.5</div>
        <div className="mt-0.5 md:mt-1">STATUS: <span className="text-green-400">ONLINE</span></div>
      </div>
      
      <div className="absolute top-2 md:top-6 right-2 md:right-6 text-purple-400/40 text-xs font-mono text-right">
        <div>NEURAL_LINK_ACTIVE</div>
        <div className="mt-0.5 md:mt-1">CONN: <span className="text-green-400 animate-pulse">●</span></div>
      </div>

      <style jsx global>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.4);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
}

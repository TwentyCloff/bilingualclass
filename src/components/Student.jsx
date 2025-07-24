import React, { useState, useEffect } from 'react';
import { User, Users, Crown, Star, BookOpen, DollarSign, Shield, Building, Award } from 'lucide-react';

export default function ClassStructure() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Students who are not in leadership positions
  const students = [
    "Aurelia", "Chalisa", "Danu", "Fiqry", "Falan", "Fathul", 
    "Firly", "Hayyu", "Jessica", "Laras", "Lukas", "Fakhar", 
    "Firza", "Nazwa", "Quinsha", "Aisy", "Salsabiela", "Shabrina", "Shafira", 
    "Humaira", "Tiara", "Utin", "Willy"
  ];

  const PersonCard = ({ name, role, icon, delay = 0, isLeader = false, isExecutive = false }) => {
    const IconComponent = icon;
    
    return (
      <div 
        className={`transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className={`group relative overflow-hidden backdrop-blur-sm
          ${isExecutive 
            ? 'bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-black/90 border-2 border-slate-400/30 shadow-2xl shadow-slate-400/10' 
            : isLeader 
              ? 'bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-black/80 border border-slate-500/40 shadow-xl shadow-slate-500/10' 
              : 'bg-gradient-to-br from-slate-950/70 to-black/90 border border-slate-600/30 shadow-lg'
          } 
          hover:shadow-2xl hover:shadow-white/5 transition-all duration-500 hover:scale-105 hover:border-white/50
          ${isExecutive ? 'rounded-2xl p-6 sm:p-8' : isLeader ? 'rounded-xl p-4 sm:p-6' : 'rounded-lg p-3 sm:p-4'}
        `}>
          
          {/* Premium glow effect for executives */}
          {isExecutive && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-slate-400/5 rounded-2xl"></div>
          )}
          
          {/* Subtle animated border for leaders */}
          {isLeader && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          )}

          <div className="relative flex flex-col items-center text-center">
            {/* Executive badge */}
            {isExecutive && (
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full border border-amber-300/50 shadow-lg shadow-amber-400/30"></div>
            )}

            {/* Icon container */}
            <div className={`
              ${isExecutive 
                ? 'w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-700/50 to-slate-800/30 border-2 border-slate-400/40' 
                : isLeader 
                  ? 'w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-500/40' 
                  : 'w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-900/50 to-black/30 border border-slate-600/30'
              } 
              rounded-full flex items-center justify-center mb-3 sm:mb-4 
              group-hover:border-white/60 group-hover:shadow-lg group-hover:shadow-white/10 
              transition-all duration-500 relative overflow-hidden
            `}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <IconComponent className={`
                ${isExecutive ? 'w-7 h-7 sm:w-9 sm:h-9' : isLeader ? 'w-5 h-5 sm:w-7 sm:h-7' : 'w-4 h-4 sm:w-5 sm:h-5'} 
                text-slate-300 group-hover:text-white transition-all duration-500 relative z-10
                ${isExecutive ? 'drop-shadow-lg' : ''}
              `} />
            </div>

            {/* Name */}
            <h3 className={`
              ${isExecutive 
                ? 'text-lg sm:text-xl font-semibold bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent' 
                : isLeader 
                  ? 'text-base sm:text-lg font-medium text-slate-200' 
                  : 'text-sm sm:text-base font-normal text-slate-300'
              } 
              mb-2 tracking-wide leading-tight break-words max-w-full
            `}>
              {name}
            </h3>

            {/* Role */}
            <p className={`
              ${isExecutive 
                ? 'text-xs sm:text-sm text-slate-400 font-medium tracking-wider' 
                : 'text-xs text-slate-400 font-light tracking-widest'
              } 
              uppercase mb-2
            `}>
              {role}
            </p>

            {/* Decorative line for leaders */}
            {(isLeader || isExecutive) && (
              <div className={`
                ${isExecutive ? 'w-12 sm:w-16 h-0.5' : 'w-8 sm:w-12 h-px'} 
                bg-gradient-to-r from-transparent via-slate-400/60 to-transparent 
                group-hover:via-white/80 transition-all duration-500
              `}></div>
            )}

            {/* Executive additional info */}
            {isExecutive && (
              <div className="mt-3 px-3 py-1 bg-slate-800/50 border border-slate-600/30 rounded-full">
                <span className="text-xs text-slate-400 font-medium tracking-wider">EXECUTIVE</span>
              </div>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-inherit"></div>
        </div>
      </div>
    );
  };

  const ConnectionLine = ({ vertical = true, length = "medium", className = "" }) => {
    const heightClasses = {
      short: vertical ? 'h-4 sm:h-6' : 'w-8 sm:w-12',
      medium: vertical ? 'h-6 sm:h-8' : 'w-12 sm:w-16',
      long: vertical ? 'h-8 sm:h-12' : 'w-16 sm:w-24'
    };
    
    return (
      <div className={`
        ${vertical ? 'w-px' : 'h-px'} 
        ${heightClasses[length]} 
        bg-gradient-to-${vertical ? 'b' : 'r'} from-slate-500/60 via-slate-400/80 to-slate-500/60 
        ${className}
      `}></div>
    );
  };

  const ConnectionHub = ({ size = "small" }) => {
    const sizeClasses = {
      small: 'w-2 h-2',
      medium: 'w-3 h-3',
      large: 'w-4 h-4'
    };
    
    return (
      <div className={`
        ${sizeClasses[size]} 
        bg-gradient-to-br from-slate-400 to-slate-600 
        rounded-full shadow-lg shadow-slate-400/30 
        border border-slate-300/40
      `}></div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        
        {/* Enhanced Header */}
        <div 
          className={`text-center mb-16 sm:mb-24 transform transition-all duration-1500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-3xl"></div>
            <h1 className="relative text-4xl sm:text-5xl md:text-7xl font-light tracking-[0.15em] sm:tracking-[0.2em] mb-6 bg-gradient-to-r from-slate-200 via-white to-slate-200 bg-clip-text text-transparent">
              ORGANIZATIONAL STRUCTURE
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-slate-400"></div>
            <Building className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
            <div className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-slate-400"></div>
          </div>
          
          <h2 className="text-lg sm:text-xl font-light tracking-[0.3em] text-slate-400 uppercase mb-4">
            XI-A Bilingual Class
          </h2>
          
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900/50 border border-slate-600/30 rounded-full backdrop-blur-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-slate-300 tracking-wider">Academic Year 2025/2026</span>
          </div>
        </div>

        {/* Organizational Chart */}
        <div className="flex flex-col items-center space-y-12 sm:space-y-16">
          
          {/* Level 1: Homeroom Teacher */}
          <div className="flex justify-center relative">
            <PersonCard 
              name="Sir Amin S.Pd" 
              role="Homeroom Teacher" 
              icon={Crown}
              delay={200}
              isExecutive={true}
            />
            {/* Top decorative element */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full border border-amber-300/50 shadow-lg shadow-amber-400/30"></div>
                <div className="w-px h-4 bg-gradient-to-b from-amber-400/60 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Connection from teacher */}
          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="medium" />
            <ConnectionLine vertical length="short" />
          </div>

          {/* Level 2: Class President & Vice President */}
          <div className="relative w-full max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 lg:gap-24">
              <PersonCard 
                name="Nadine" 
                role="Class President" 
                icon={Star}
                delay={400}
                isExecutive={true}
              />
              <PersonCard 
                name="Alicia" 
                role="Vice President" 
                icon={User}
                delay={500}
                isLeader={true}
              />
            </div>
            
            {/* Enhanced connection line - adaptive for mobile */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center">
              <div className="flex items-center">
                <div className="w-12 lg:w-20 h-px bg-gradient-to-r from-slate-500/40 via-slate-400/80 to-slate-500/40"></div>
                <ConnectionHub size="small" />
                <div className="w-12 lg:w-20 h-px bg-gradient-to-r from-slate-500/40 via-slate-400/80 to-slate-500/40"></div>
              </div>
            </div>
          </div>

          {/* Connection to secretaries */}
          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="medium" />
            <ConnectionLine vertical length="short" />
          </div>

          {/* Level 3: Secretaries */}
          <div className="relative w-full max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 lg:gap-24">
              <PersonCard 
                name="Mecca" 
                role="Secretary 1" 
                icon={BookOpen}
                delay={600}
                isLeader={true}
              />
              <PersonCard 
                name="Keisha" 
                role="Secretary 2" 
                icon={BookOpen}
                delay={700}
                isLeader={true}
              />
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center">
              <div className="flex items-center">
                <div className="w-12 lg:w-20 h-px bg-gradient-to-r from-slate-500/40 via-slate-400/80 to-slate-500/40"></div>
                <ConnectionHub size="small" />
                <div className="w-12 lg:w-20 h-px bg-gradient-to-r from-slate-500/40 via-slate-400/80 to-slate-500/40"></div>
              </div>
            </div>
          </div>

          {/* Connection to treasurers */}
          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="medium" />
            <ConnectionLine vertical length="short" />
          </div>

          {/* Level 4: Treasurers */}
          <div className="relative w-full max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 lg:gap-24">
              <PersonCard 
                name="Fairuz" 
                role="Treasurer 1" 
                icon={DollarSign}
                delay={800}
                isLeader={true}
              />
              <PersonCard 
                name="Kania" 
                role="Treasurer 2" 
                icon={DollarSign}
                delay={900}
                isLeader={true}
              />
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center">
              <div className="flex items-center">
                <div className="w-12 lg:w-20 h-px bg-gradient-to-r from-slate-500/40 via-slate-400/80 to-slate-500/40"></div>
                <ConnectionHub size="small" />
                <div className="w-12 lg:w-20 h-px bg-gradient-to-r from-slate-500/40 via-slate-400/80 to-slate-500/40"></div>
              </div>
            </div>
          </div>

          {/* Connection to discipline committee */}
          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="large" />
            <ConnectionLine vertical length="short" />
          </div>

          {/* Level 5: Discipline Committee */}
          <div className="flex flex-col items-center w-full">
            {/* Section Header */}
            <div className="mb-10 text-center relative">
              <div className="inline-flex items-center gap-3 px-8 py-3 bg-slate-900/60 border border-slate-600/40 rounded-2xl backdrop-blur-sm">
                <Shield className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg sm:text-xl font-medium text-slate-200 uppercase tracking-widest">
                  Discipline Committee
                </h3>
                <Shield className="w-5 h-5 text-slate-400" />
              </div>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-slate-400/60 to-transparent"></div>
            </div>
            
            {/* Discipline Members Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 w-full max-w-6xl">
              {[
                { name: "Fredy", delay: 1000 },
                { name: "Sandi", delay: 1100 },
                { name: "Dara", delay: 1200 },
                { name: "Kenzo", delay: 1300 },
                { name: "Dahlia", delay: 1400 },
                { name: "Kalinda", delay: 1500 }
              ].map((member) => (
                <PersonCard 
                  key={member.name}
                  name={member.name} 
                  role="Discipline" 
                  icon={Shield}
                  delay={member.delay}
                  isLeader={true}
                />
              ))}
            </div>
          </div>

          {/* Final connection to students */}
          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="large" />
            <div className="w-px h-6 bg-gradient-to-b from-slate-400/60 to-transparent"></div>
          </div>

          {/* Level 6: Class Members */}
          <div className="flex flex-col items-center w-full">
            {/* Section Header */}
            <div className="mb-12 text-center relative">
              <div className="inline-flex items-center gap-4 px-10 py-4 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-500/40 rounded-2xl backdrop-blur-sm shadow-xl">
                <Users className="w-6 h-6 text-slate-400" />
                <h3 className="text-xl sm:text-2xl font-medium text-slate-200 uppercase tracking-widest">
                  Class Members
                </h3>
                <Users className="w-6 h-6 text-slate-400" />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-slate-400/60 to-transparent"></div>
            </div>
            
            {/* Students Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-5 w-full max-w-7xl">
              {students.map((student, index) => (
                <PersonCard 
                  key={student}
                  name={student} 
                  role="Student" 
                  icon={Users}
                  delay={1600 + (index * 30)}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Total Count */}
          <div 
            className={`mt-16 sm:mt-20 text-center transform transition-all duration-1500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: '3000ms' }}
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 via-slate-500/30 to-slate-600/20 blur-xl rounded-2xl"></div>
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-2 border-slate-400/40 rounded-2xl px-12 py-6 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-700/50 to-slate-800/30 border border-slate-500/40 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">Total Students</p>
                    <p className="text-white font-semibold text-3xl sm:text-4xl bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent">35</p>
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Border */}
        <div className="mt-20 sm:mt-24 relative">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ConnectionHub size="small" />
          </div>
        </div>
      </div>
    </div>
  );
}

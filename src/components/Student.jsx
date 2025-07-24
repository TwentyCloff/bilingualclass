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

  // Badge options list
  const badgeOptions = [
    'EXECUTIVE', 'LEADER', 'The Smartest', 'The Fluent', 'The Brain', 'The Genius', 
    'The Whiz', 'The Prodigy', 'The Ace', 'The Bright One', 'The Quick Thinker', 
    'The Polyglot', 'The Speaker', 'The Nerdy Cool', 'The Go-To', 'The Solver', 
    'The Chill Genius', 'The Top Rank', 'The Bookworm', 'The Bilingual Star', 
    'The English Ace', 'The Calm Genius', 'The Hidden Brain', 'The Lowkey Legend', 
    'The Silent Strategist', 'The Language Hero', 'The Thinker', 'The Scholar', 
    'The Visionary', 'The Captain', 'The Noble', 'The Focused', 'The Sharpest', 
    'The Valedict', 'The Quiet Flame', 'The Quiet Power', 'The Main Mind', 
    'The Silent Ace', 'The Neo Genius', 'The Teacher'
  ];

  const getRoleShape = (role) => {
    switch(role) {
      case 'Homeroom Teacher':
        return (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rotate-45 rounded-lg shadow-2xl"></div>
          </div>
        );
      case 'Class President':
        return (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full shadow-2xl"></div>
          </div>
        );
      case 'Vice President':
        return (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-2xl"></div>
          </div>
        );
      case 'Secretary 1':
      case 'Secretary 2':
        return (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 transform rotate-45 shadow-2xl"></div>
          </div>
        );
      case 'Treasurer 1':
      case 'Treasurer 2':
        return (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-emerald-500 shadow-2xl"></div>
          </div>
        );
      case 'PDD Member':
        return (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 transform rotate-45 rounded-sm shadow-2xl"></div>
          </div>
        );
      case 'Student':
        return (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full shadow-lg"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const PersonCard = ({ name, role, icon, delay = 0, badge = null }) => {
    const IconComponent = icon;
    
    // Badge styling based on type
    const getBadgeStyle = (badgeText) => {
      if (badgeText === 'EXECUTIVE') {
        return {
          bgColor: 'bg-amber-400/10 group-hover:bg-amber-400/20 border-amber-400/20',
          textColor: 'text-amber-400',
          hoverBorder: 'hover:border-amber-400/50'
        };
      } else if (badgeText === 'LEADER') {
        return {
          bgColor: 'bg-cyan-400/10 group-hover:bg-cyan-400/20 border-cyan-400/20',
          textColor: 'text-cyan-400',
          hoverBorder: 'hover:border-cyan-400/50'
        };
      } else {
        return {
          bgColor: 'bg-purple-400/10 group-hover:bg-purple-400/20 border-purple-400/20',
          textColor: 'text-purple-400',
          hoverBorder: 'hover:border-purple-400/50'
        };
      }
    };

    const badgeStyle = badge ? getBadgeStyle(badge) : null;
    
    return (
      <div 
        className={`transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className={`group relative overflow-hidden
          bg-black border border-white/10 shadow-xl ${badgeStyle?.hoverBorder || 'hover:border-white/20'}
          transition-all duration-500 hover:scale-105 rounded-xl p-6
          backdrop-blur-sm hover:shadow-2xl
        `}>
          
          {/* Role Shape */}
          {getRoleShape(role)}
          
          {/* Premium border for badge holders */}
          {badge && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 rounded-xl"></div>
          )}

          <div className="relative flex flex-col items-center text-center">
            {/* Icon container */}
            <div className={`
              w-16 h-16 bg-black border border-white/10 group-hover:border-cyan-400/50
              rounded-full flex items-center justify-center mb-4 
              transition-all duration-500 relative overflow-hidden
            `}>
              <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80"></div>
              <IconComponent className={`
                w-7 h-7 text-cyan-400 
                relative z-10 group-hover:scale-110 transition-all duration-500
              `} />
            </div>

            {/* Name */}
            <h3 className={`
              text-lg font-semibold text-white group-hover:text-cyan-400
              mb-2 tracking-wide leading-tight transition-all duration-300
            `}>
              {name}
            </h3>

            {/* Role */}
            <p className={`
              text-xs text-gray-400 font-normal group-hover:text-white
              uppercase tracking-wider mb-3 transition-all duration-300
            `}>
              {role}
            </p>

            {/* Decorative line */}
            <div className={`
              w-12 h-0.5 
              bg-gradient-to-r from-transparent via-white/20 to-transparent 
              group-hover:via-white/40 transition-all duration-500 rounded-full
            `}></div>

            {/* Badge */}
            {badge && (
              <div className={`mt-4 px-4 py-1 border rounded-full transition-all duration-300 ${badgeStyle.bgColor}`}>
                <span className={`text-xs font-semibold tracking-wider ${badgeStyle.textColor}`}>
                  {badge}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ConnectionLine = ({ vertical = true, length = "medium" }) => {
    const heightClasses = {
      short: vertical ? 'h-6' : 'w-12',
      medium: vertical ? 'h-8' : 'w-16',
      long: vertical ? 'h-12' : 'w-24'
    };
    
    return (
      <div className={`
        ${vertical ? 'w-0.5' : 'h-0.5'} 
        ${heightClasses[length]} 
        bg-gradient-to-${vertical ? 'b' : 'r'} from-white/20 via-white/40 to-white/20
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
        bg-gradient-to-br from-white/40 to-white/60 
        rounded-full shadow-lg
      `}></div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-20 px-6">
      {/* Modern Grid Pattern Background (Subtle) */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        
        {/* Modern Header */}
        <div 
          className={`text-center mb-24 transform transition-all duration-1500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        >
          <h1 className="text-6xl font-light tracking-[0.2em] mb-6 text-white">
            <span className="relative">
              CLASS STRUCTURE
              <span className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></span>
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent to-white/40"></div>
            <Building className="w-6 h-6 text-white/60" />
            <div className="w-24 h-px bg-gradient-to-l from-transparent to-white/40"></div>
          </div>
          
          <h2 className="text-xl font-light tracking-[0.3em] text-gray-300 uppercase mb-6">
            <span className="text-white font-medium">XI-A BILINGUAL</span> CLASS
          </h2>
          
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-black border border-white/10 rounded-full backdrop-blur-sm shadow-2xl hover:border-white/20 transition-all duration-300">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-white tracking-wider font-medium">Academic Year 2025/2026</span>
          </div>
        </div>

        {/* Organizational Chart */}
        <div className="flex flex-col items-center space-y-16">
          
          {/* Level 1: Homeroom Teacher */}
          <PersonCard 
            name="Sir Amin S.Pd" 
            role="Homeroom Teacher" 
            icon={Crown}
            delay={200}
            badge="The Teacher"
          />

          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="medium" />
            <ConnectionLine vertical length="short" />
          </div>

          {/* Level 2: Class President & Vice President */}
          <div className="relative w-full max-w-2xl">
            <div className="flex items-center justify-center gap-24">
              <PersonCard 
                name="Nadine" 
                role="Class President" 
                icon={Star}
                delay={400}
                badge="The Captain"
              />
              <PersonCard 
                name="Alicia" 
                role="Vice President" 
                icon={User}
                delay={500}
                badge="The Visionary"
              />
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
              <div className="w-20 h-0.5 bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
              <ConnectionHub size="small" />
              <div className="w-20 h-0.5 bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="medium" />
            <ConnectionLine vertical length="short" />
          </div>

          {/* Level 3: Secretaries */}
          <div className="relative w-full max-w-2xl">
            <div className="flex items-center justify-center gap-24">
              <PersonCard 
                name="Mecca" 
                role="Secretary 1" 
                icon={BookOpen}
                delay={600}
                badge="The Scholar"
              />
              <PersonCard 
                name="Keisha" 
                role="Secretary 2" 
                icon={BookOpen}
                delay={700}
                badge="The Focused"
              />
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
              <div className="w-20 h-0.5 bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
              <ConnectionHub size="small" />
              <div className="w-20 h-0.5 bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="medium" />
            <ConnectionLine vertical length="short" />
          </div>

          {/* Level 4: Treasurers */}
          <div className="relative w-full max-w-2xl">
            <div className="flex items-center justify-center gap-24">
              <PersonCard 
                name="Fairuz" 
                role="Treasurer 1" 
                icon={DollarSign}
                delay={800}
                badge="The Genius"
              />
              <PersonCard 
                name="Kania" 
                role="Treasurer 2" 
                icon={DollarSign}
                delay={900}
                badge="The Solver"
              />
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
              <div className="w-20 h-0.5 bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
              <ConnectionHub size="small" />
              <div className="w-20 h-0.5 bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="large" />
            <ConnectionLine vertical length="short" />
          </div>

          {/* Level 5: PDD Team */}
          <div className="flex flex-col items-center w-full">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-4 px-10 py-4 bg-black border border-white/10 rounded-2xl backdrop-blur-sm shadow-2xl hover:border-red-400/50 transition-all duration-300">
                <Shield className="w-6 h-6 text-red-400" />
                <h3 className="text-2xl font-medium text-white uppercase tracking-widest">
                  PDD TEAM
                </h3>
                <Shield className="w-6 h-6 text-red-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 w-full max-w-6xl">
              {[
                { name: "Fredy", delay: 1000, badge: "The Noble" },
                { name: "Sandi", delay: 1100, badge: "The Sharpest" },
                { name: "Dara", delay: 1200, badge: "The Quick Thinker" },
                { name: "Kenzo", delay: 1300, badge: "The Silent Strategist" },
                { name: "Dahlia", delay: 1400, badge: "The Quiet Power" },
                { name: "Kalinda", delay: 1500, badge: "The Lowkey Legend" }
              ].map((member) => (
                <PersonCard 
                  key={member.name}
                  name={member.name} 
                  role="PDD Member" 
                  icon={Shield}
                  delay={member.delay}
                  badge={member.badge}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="large" />
            <div className="w-0.5 h-6 bg-gradient-to-b from-white/40 to-transparent"></div>
          </div>

          {/* Level 6: Class Members */}
          <div className="flex flex-col items-center w-full">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-4 px-12 py-4 bg-black border border-white/10 rounded-2xl backdrop-blur-sm shadow-2xl hover:border-white/20 transition-all duration-300">
                <Users className="w-6 h-6 text-white" />
                <h3 className="text-2xl font-medium text-white uppercase tracking-widest">
                  Class Members
                </h3>
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-5 w-full max-w-7xl">
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

          {/* Total Count */}
          <div 
            className={`mt-20 text-center transform transition-all duration-1500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: '3000ms' }}
          >
            <div className="inline-block bg-black border border-white/10 rounded-2xl px-12 py-6 backdrop-blur-sm shadow-2xl hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-black border border-white/10 rounded-full flex items-center justify-center hover:border-cyan-400/50 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80"></div>
                  <Users className="w-6 h-6 text-cyan-400 relative z-10" />
                </div>
                <div className="text-left">
                  <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Total Students</p>
                  <p className="text-white font-bold text-4xl">35</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-24 relative">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ConnectionHub size="small" />
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
    </div>
  );
}

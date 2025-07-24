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

  const getRoleShape = (role) => {
    switch(role) {
      case 'Homeroom Teacher':
        return (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rotate-45 rounded-lg shadow-lg"></div>
          </div>
        );
      case 'Class President':
        return (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-lg"></div>
          </div>
        );
      case 'Vice President':
        return (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full shadow-lg"></div>
          </div>
        );
      case 'Secretary 1':
      case 'Secretary 2':
        return (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-700 transform rotate-45 shadow-lg"></div>
          </div>
        );
      case 'Treasurer 1':
      case 'Treasurer 2':
        return (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-emerald-600 shadow-lg"></div>
          </div>
        );
      case 'Discipline':
        return (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 transform rotate-45 rounded-sm shadow-lg"></div>
          </div>
        );
      case 'Student':
        return (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow-md"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const PersonCard = ({ name, role, icon, delay = 0, isLeader = false, isExecutive = false }) => {
    const IconComponent = icon;
    
    return (
      <div 
        className={`transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className={`group relative overflow-hidden
          ${isExecutive 
            ? 'bg-white/95 border border-gray-200 shadow-2xl hover:shadow-3xl' 
            : isLeader 
              ? 'bg-white/90 border border-gray-200 shadow-xl hover:shadow-2xl' 
              : 'bg-white/85 border border-gray-200 shadow-lg hover:shadow-xl'
          } 
          transition-all duration-500 hover:scale-105
          ${isExecutive ? 'rounded-2xl p-8' : isLeader ? 'rounded-xl p-6' : 'rounded-lg p-4'}
          backdrop-blur-sm
        `}>
          
          {/* Role Shape */}
          {getRoleShape(role)}
          
          {/* Executive premium border */}
          {isExecutive && (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-amber-400/5 rounded-2xl"></div>
          )}

          <div className="relative flex flex-col items-center text-center">
            {/* Icon container */}
            <div className={`
              ${isExecutive 
                ? 'w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300' 
                : isLeader 
                  ? 'w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300' 
                  : 'w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300'
              } 
              rounded-full flex items-center justify-center mb-4 
              group-hover:border-gray-400 group-hover:shadow-lg 
              transition-all duration-500
            `}>
              <IconComponent className={`
                ${isExecutive ? 'w-9 h-9' : isLeader ? 'w-7 h-7' : 'w-5 h-5'} 
                text-gray-600 group-hover:text-gray-700 transition-all duration-500
              `} />
            </div>

            {/* Name */}
            <h3 className={`
              ${isExecutive 
                ? 'text-xl font-bold text-gray-800' 
                : isLeader 
                  ? 'text-lg font-semibold text-gray-700' 
                  : 'text-base font-medium text-gray-700'
              } 
              mb-2 tracking-wide leading-tight
            `}>
              {name}
            </h3>

            {/* Role */}
            <p className={`
              ${isExecutive 
                ? 'text-sm text-gray-500 font-medium' 
                : 'text-xs text-gray-500 font-normal'
              } 
              uppercase tracking-wider mb-3
            `}>
              {role}
            </p>

            {/* Decorative line */}
            {(isLeader || isExecutive) && (
              <div className={`
                ${isExecutive ? 'w-16 h-1' : 'w-12 h-0.5'} 
                bg-gradient-to-r from-transparent via-gray-300 to-transparent 
                group-hover:via-gray-400 transition-all duration-500 rounded-full
              `}></div>
            )}

            {/* Executive badge */}
            {isExecutive && (
              <div className="mt-4 px-4 py-1 bg-amber-100 border border-amber-200 rounded-full">
                <span className="text-xs text-amber-700 font-semibold tracking-wider">EXECUTIVE</span>
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
        bg-gradient-to-${vertical ? 'b' : 'r'} from-gray-300 via-gray-400 to-gray-300
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
        bg-gradient-to-br from-gray-400 to-gray-600 
        rounded-full shadow-lg
      `}></div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 px-6">
      <div className="max-w-8xl mx-auto">
        
        {/* Modern Header */}
        <div 
          className={`text-center mb-24 transform transition-all duration-1500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        >
          <h1 className="text-6xl font-light tracking-[0.2em] mb-6 text-gray-800">
            ORGANIZATIONAL STRUCTURE
          </h1>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent to-gray-400"></div>
            <Building className="w-6 h-6 text-gray-400" />
            <div className="w-24 h-px bg-gradient-to-l from-transparent to-gray-400"></div>
          </div>
          
          <h2 className="text-xl font-light tracking-[0.3em] text-gray-600 uppercase mb-6">
            XI-A Bilingual Class
          </h2>
          
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/80 border border-gray-200 rounded-full backdrop-blur-sm shadow-lg">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-gray-600 tracking-wider font-medium">Academic Year 2025/2026</span>
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
            isExecutive={true}
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
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
              <div className="w-20 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
              <ConnectionHub size="small" />
              <div className="w-20 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
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
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
              <div className="w-20 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
              <ConnectionHub size="small" />
              <div className="w-20 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
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
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
              <div className="w-20 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
              <ConnectionHub size="small" />
              <div className="w-20 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="large" />
            <ConnectionLine vertical length="short" />
          </div>

          {/* Level 5: Discipline Committee */}
          <div className="flex flex-col items-center w-full">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-4 px-10 py-4 bg-white/90 border border-gray-200 rounded-2xl backdrop-blur-sm shadow-xl">
                <Shield className="w-6 h-6 text-red-600" />
                <h3 className="text-2xl font-medium text-gray-800 uppercase tracking-widest">
                  Discipline Committee
                </h3>
                <Shield className="w-6 h-6 text-red-600" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 w-full max-w-6xl">
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

          <div className="flex flex-col items-center">
            <ConnectionLine vertical length="long" />
            <ConnectionHub size="large" />
            <div className="w-0.5 h-6 bg-gradient-to-b from-gray-400 to-transparent"></div>
          </div>

          {/* Level 6: Class Members */}
          <div className="flex flex-col items-center w-full">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-4 px-12 py-4 bg-white/95 border border-gray-200 rounded-2xl backdrop-blur-sm shadow-xl">
                <Users className="w-6 h-6 text-gray-600" />
                <h3 className="text-2xl font-medium text-gray-800 uppercase tracking-widest">
                  Class Members
                </h3>
                <Users className="w-6 h-6 text-gray-600" />
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
            <div className="inline-block bg-white/95 border border-gray-200 rounded-2xl px-12 py-6 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">Total Students</p>
                  <p className="text-gray-800 font-bold text-4xl">35</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-24 relative">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ConnectionHub size="small" />
          </div>
        </div>
      </div>
    </div>
  );
}

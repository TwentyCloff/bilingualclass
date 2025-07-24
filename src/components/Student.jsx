import React, { useState, useEffect } from 'react';
import { User, Users, Crown, Star, BookOpen, DollarSign, Shield } from 'lucide-react';

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

  const PersonCard = ({ name, role, icon, delay = 0, isLeader = false }) => {
    const IconComponent = icon;
    
    return (
      <div 
        className={`transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className={`group relative ${isLeader ? 'bg-gradient-to-br from-gray-900 to-black border-2 border-white/30' : 'bg-black border border-white/20'} hover:border-white/40 p-4 sm:p-6 transition-all duration-300 shadow-xl rounded-lg hover:shadow-lg ${isLeader ? 'hover:shadow-white/10' : 'hover:shadow-white/5'}`}>
          <div className="flex flex-col items-center text-center">
            <div className={`${isLeader ? 'w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white/10 to-white/5' : 'w-10 h-10 sm:w-12 sm:h-12'} border border-white/30 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:border-white/50 transition-colors duration-300`}>
              <IconComponent className={`${isLeader ? 'w-5 h-5 sm:w-7 sm:h-7' : 'w-4 h-4 sm:w-5 sm:h-5'} ${isLeader ? 'text-yellow-400' : 'text-white/70'} group-hover:text-white transition-colors duration-300`} />
            </div>
            <h3 className={`${isLeader ? 'text-sm sm:text-lg font-medium' : 'text-xs sm:text-sm font-light'} text-white mb-1 tracking-wide text-center break-words max-w-full`}>{name}</h3>
            <p className={`text-xs ${isLeader ? 'text-white/70' : 'text-white/50'} uppercase tracking-widest`}>{role}</p>
            {isLeader && (
              <div className="mt-2 w-6 sm:w-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ConnectionLine = ({ horizontal = false, className = "" }) => (
    <div className={`bg-white/20 ${horizontal ? 'h-px w-full' : 'w-px h-4 sm:h-6'} ${className}`}></div>
  );

  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className={`text-center mb-10 sm:mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.1em] sm:tracking-[0.2em] mb-4">
            CLASS STRUCTURE
          </h1>
          <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent mx-auto mb-4 sm:mb-6"></div>
          <h2 className="text-sm sm:text-lg font-light tracking-[0.2em] sm:tracking-[0.3em] text-white/60 uppercase">
            XI-A Bilingual Organization
          </h2>
        </div>

        {/* Organizational Chart */}
        <div className="flex flex-col items-center space-y-6 sm:space-y-10">
          
          {/* Level 1: Homeroom Teacher */}
          <div className="flex justify-center relative w-full">
            <div className="w-full max-w-xs">
              <PersonCard 
                name="Sir Amin S.Pd" 
                role="Homeroom Teacher" 
                icon={Crown}
                delay={0}
                isLeader={true}
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 sm:-top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            </div>
          </div>

          {/* Connection from teacher */}
          <div className="flex flex-col items-center">
            <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-white/40 to-white/20"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-px h-3 sm:h-4 bg-gradient-to-b from-white/20 to-white/10"></div>
          </div>

          {/* Level 2: Class President & Vice President */}
          <div className="flex flex-col items-center relative w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 w-full max-w-2xl">
              <div className="w-full sm:w-auto">
                <PersonCard 
                  name="Nadine" 
                  role="Class President" 
                  icon={Star}
                  delay={100}
                  isLeader={true}
                />
              </div>
              <div className="w-full sm:w-auto">
                <PersonCard 
                  name="Alicia" 
                  role="Vice President" 
                  icon={User}
                  delay={200}
                  isLeader={true}
                />
              </div>
            </div>
            {/* Enhanced connection line */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:block">
              <div className="w-16 lg:w-24 h-px bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>

          {/* Connection to secretaries */}
          <div className="flex flex-col items-center">
            <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-white/30 to-white/20"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-px h-3 sm:h-4 bg-gradient-to-b from-white/20 to-white/10"></div>
          </div>

          {/* Level 3: Secretaries */}
          <div className="flex flex-col items-center relative w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 w-full max-w-2xl">
              <div className="w-full sm:w-auto">
                <PersonCard 
                  name="Mecca" 
                  role="Secretary 1" 
                  icon={BookOpen}
                  delay={300}
                  isLeader={true}
                />
              </div>
              <div className="w-full sm:w-auto">
                <PersonCard 
                  name="Keisha" 
                  role="Secretary 2" 
                  icon={BookOpen}
                  delay={400}
                  isLeader={true}
                />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:block">
              <div className="w-16 lg:w-24 h-px bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>

          {/* Connection to treasurers */}
          <div className="flex flex-col items-center">
            <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-white/30 to-white/20"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-px h-3 sm:h-4 bg-gradient-to-b from-white/20 to-white/10"></div>
          </div>

          {/* Level 4: Treasurers */}
          <div className="flex flex-col items-center relative w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 w-full max-w-2xl">
              <div className="w-full sm:w-auto">
                <PersonCard 
                  name="Fairuz" 
                  role="Treasurer 1" 
                  icon={DollarSign}
                  delay={500}
                  isLeader={true}
                />
              </div>
              <div className="w-full sm:w-auto">
                <PersonCard 
                  name="Kania" 
                  role="Treasurer 2" 
                  icon={DollarSign}
                  delay={600}
                  isLeader={true}
                />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:block">
              <div className="w-16 lg:w-24 h-px bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>

          {/* Connection to discipline committee */}
          <div className="flex flex-col items-center">
            <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-white/30 to-white/20"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-px h-3 sm:h-4 bg-gradient-to-b from-white/20 to-white/10"></div>
          </div>

          {/* Level 5: Discipline Committee */}
          <div className="flex flex-col items-center mb-6 sm:mb-10 relative w-full">
            <h3 className="text-base sm:text-lg font-light text-white/80 uppercase tracking-widest mb-6 sm:mb-8 relative">
              Discipline Committee
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 w-full max-w-5xl relative">
              <PersonCard 
                name="Fredy" 
                role="Discipline" 
                icon={Shield}
                delay={700}
                isLeader={true}
              />
              <PersonCard 
                name="Sandi" 
                role="Discipline" 
                icon={Shield}
                delay={800}
                isLeader={true}
              />
              <PersonCard 
                name="Dara" 
                role="Discipline" 
                icon={Shield}
                delay={900}
                isLeader={true}
              />
              <PersonCard 
                name="Kenzo" 
                role="Discipline" 
                icon={Shield}
                delay={1000}
                isLeader={true}
              />
              <PersonCard 
                name="Dahlia" 
                role="Discipline" 
                icon={Shield}
                delay={1100}
                isLeader={true}
              />
              <PersonCard 
                name="Kalinda" 
                role="Discipline" 
                icon={Shield}
                delay={1200}
                isLeader={true}
              />
            </div>
          </div>

          {/* Final connection to students */}
          <div className="flex flex-col items-center">
            <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-white/30 to-white/10"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-white/40 to-white/20 rounded-full"></div>
            <div className="w-px h-4 sm:h-6 bg-gradient-to-b from-white/10 to-transparent"></div>
          </div>

          {/* Level 6: Class Members */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-base sm:text-lg font-light text-white/80 uppercase tracking-widest mb-6 sm:mb-8 relative">
              Class Members
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 sm:w-28 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 w-full max-w-6xl">
              {students.map((student, index) => (
                <PersonCard 
                  key={student}
                  name={student} 
                  role="Student" 
                  icon={Users}
                  delay={1300 + (index * 50)}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Total Count */}
          <div 
            className={`mt-12 sm:mt-16 text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: '2500ms' }}
          >
            <div className="border-2 border-white/30 bg-gradient-to-br from-white/5 to-transparent px-6 sm:px-8 py-3 sm:py-4 inline-block relative rounded-lg">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <p className="text-white/70 text-sm sm:text-base uppercase tracking-widest">
                Total Students: <span className="text-white font-medium text-lg sm:text-xl">35</span>
              </p>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-12 sm:mt-16 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </div>
  );
}

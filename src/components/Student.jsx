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

  const PersonCard = ({ name, role, icon, delay = 0, isLeader = false, isTeacher = false }) => {
    const IconComponent = icon;
    
    return (
      <div 
        className={`transform transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className={`group relative ${
          isTeacher ? 'bg-gradient-to-br from-blue-900/80 to-blue-900/50 border-2 border-blue-400/30' :
          isLeader ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/50 border-2 border-white/30' : 
          'bg-gray-900/50 border border-white/15'
        } hover:border-white/50 p-4 sm:p-5 transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg overflow-hidden`}>
          
          {/* Glow effect */}
          <div className={`absolute inset-0 ${
            isTeacher ? 'bg-blue-500/5' : 
            isLeader ? 'bg-white/5' : 'bg-white/3'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          
          <div className="relative flex flex-col items-center text-center z-10">
            <div className={`${
              isTeacher ? 'w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400/10 to-blue-400/5 border-blue-400/40' :
              isLeader ? 'w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-white/10 to-white/5 border-white/40' :
              'w-10 h-10 sm:w-12 sm:h-12 border-white/20'
            } border rounded-full flex items-center justify-center mb-3 group-hover:border-white/60 transition-all duration-300`}>
              <IconComponent className={`${
                isTeacher ? 'w-6 h-6 sm:w-7 sm:h-7 text-blue-300' :
                isLeader ? 'w-5 h-5 sm:w-6 sm:h-6 text-white' :
                'w-4 h-4 sm:w-5 sm:h-5 text-white/80'
              } group-hover:text-white transition-colors duration-300`} />
            </div>
            <h3 className={`${
              isTeacher ? 'text-base sm:text-lg font-medium text-blue-100' :
              isLeader ? 'text-sm sm:text-base font-medium text-white' :
              'text-xs sm:text-sm font-light text-white'
            } mb-1 tracking-wide`}>{name}</h3>
            <p className={`text-[0.65rem] sm:text-xs ${
              isTeacher ? 'text-blue-300/80' :
              isLeader ? 'text-white/70' : 'text-white/60'
            } uppercase tracking-wider`}>{role}</p>
            
            {isTeacher && (
              <div className="mt-2 w-8 sm:w-10 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
            )}
            {isLeader && !isTeacher && (
              <div className="mt-2 w-6 sm:w-8 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ConnectionLine = ({ horizontal = false, color = 'white', className = "" }) => (
    <div className={`bg-${color}/20 ${horizontal ? 'h-px w-full' : 'w-px h-6 sm:h-8'} ${className}`}></div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 sm:py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className={`text-center mb-10 sm:mb-14 transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[0.1em] mb-4 text-white">
            ORGANIZATIONAL STRUCTURE
          </h1>
          <div className="w-20 sm:w-24 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent mx-auto mb-4 sm:mb-5"></div>
          <h2 className="text-xs sm:text-sm font-light tracking-[0.3em] text-white/70 uppercase">
            XI-A Bilingual Class • 2025/2026 Academic Year
          </h2>
        </div>

        {/* Organizational Chart */}
        <div className="flex flex-col items-center space-y-6 sm:space-y-10">
          
          {/* Level 1: Homeroom Teacher */}
          <div className="flex justify-center relative">
            <PersonCard 
              name="Sir Amin S.Pd" 
              role="Homeroom Teacher" 
              icon={Crown}
              delay={0}
              isTeacher={true}
            />
            {/* Decorative elements */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Connection from teacher */}
          <div className="flex flex-col items-center">
            <ConnectionLine color="blue" />
            <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
            <ConnectionLine color="blue" className="h-4 sm:h-5" />
          </div>

          {/* Level 2: Class President & Vice President */}
          <div className="flex flex-col items-center relative w-full max-w-lg">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 lg:space-x-16 w-full">
              <div className="flex-1 flex justify-center">
                <PersonCard 
                  name="Nadine" 
                  role="Class President" 
                  icon={Star}
                  delay={100}
                  isLeader={true}
                />
              </div>
              <div className="flex-1 flex justify-center">
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
              <div className="w-10 lg:w-16 h-px bg-gradient-to-r from-white/20 via-white/50 to-white/20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Connection to secretaries */}
          <div className="flex flex-col items-center">
            <ConnectionLine />
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
            <ConnectionLine className="h-4 sm:h-5" />
          </div>

          {/* Level 3: Secretaries */}
          <div className="flex flex-col items-center relative w-full max-w-lg">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 lg:space-x-16 w-full">
              <div className="flex-1 flex justify-center">
                <PersonCard 
                  name="Mecca" 
                  role="Secretary" 
                  icon={BookOpen}
                  delay={300}
                  isLeader={true}
                />
              </div>
              <div className="flex-1 flex justify-center">
                <PersonCard 
                  name="Keisha" 
                  role="Secretary" 
                  icon={BookOpen}
                  delay={400}
                  isLeader={true}
                />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:block">
              <div className="w-10 lg:w-16 h-px bg-gradient-to-r from-white/20 via-white/50 to-white/20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Connection to treasurers */}
          <div className="flex flex-col items-center">
            <ConnectionLine />
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
            <ConnectionLine className="h-4 sm:h-5" />
          </div>

          {/* Level 4: Treasurers */}
          <div className="flex flex-col items-center relative w-full max-w-lg">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 lg:space-x-16 w-full">
              <div className="flex-1 flex justify-center">
                <PersonCard 
                  name="Fairuz" 
                  role="Treasurer" 
                  icon={DollarSign}
                  delay={500}
                  isLeader={true}
                />
              </div>
              <div className="flex-1 flex justify-center">
                <PersonCard 
                  name="Kania" 
                  role="Treasurer" 
                  icon={DollarSign}
                  delay={600}
                  isLeader={true}
                />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:block">
              <div className="w-10 lg:w-16 h-px bg-gradient-to-r from-white/20 via-white/50 to-white/20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Connection to discipline committee */}
          <div className="flex flex-col items-center">
            <ConnectionLine />
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
            <ConnectionLine className="h-4 sm:h-5" />
          </div>

          {/* Level 5: Discipline Committee */}
          <div className="flex flex-col items-center mb-6 sm:mb-8 relative w-full">
            <h3 className="text-sm sm:text-base font-medium text-white/90 uppercase tracking-widest mb-6 relative">
              Discipline Committee
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 w-full max-w-4xl relative">
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
            <ConnectionLine />
            <div className="w-2.5 h-2.5 bg-white/50 rounded-full animate-pulse"></div>
            <ConnectionLine className="h-5 sm:h-6" />
          </div>

          {/* Level 6: Class Members */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-sm sm:text-base font-medium text-white/90 uppercase tracking-widest mb-6 relative">
              Class Members
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 w-full max-w-5xl">
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
            className={`mt-10 sm:mt-12 text-center transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '2500ms' }}
          >
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="border border-white/30 bg-gradient-to-br from-white/5 to-transparent px-6 sm:px-8 py-3 sm:py-4 rounded-lg relative overflow-hidden">
                <p className="relative text-white/80 text-xs sm:text-sm uppercase tracking-widest">
                  Total Members: <span className="text-blue-300 font-medium text-base sm:text-lg">35</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-12 sm:mt-14 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Phone, Mail, User, ChevronDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teachers = [
    { name: "AMIN ABDI LUHUR, S.Pd", phone: "+62 857-5282-7179" },
    { name: "ADNIN RAHMAH, S.Pd", phone: "+62 821-4862-3962" },
    { name: "MELANUS DENI L., S.Pd", phone: "" },
    { name: "MUSTAQIM, S.Pd", phone: "+62 897-2777-858" },
    { name: "EUIS SINTAWATY, S.Pd", phone: "+62 852-4596-9881" },
    { name: "SANNUR SIREGAR, S.Pd", phone: "+62 813-4825-6859" },
    { name: "MUHAMMAD SABHAN NURDIANSYAH, S.Pd", phone: "+62 896-2656-2520" },
    { name: "ALEX DANAN SUNTADI, S.Pd", phone: "" },
    { name: "UTIN ERLIANA, S.Pd", phone: "" },
    { name: "FITRI ANNISA, S.Pd", phone: "+62 895-2705-3856" },
    { name: "EVIN NURIZKI", phone: "+62 895-3504-48645" },
    { name: "SITI MARYAM, S.Pd.I", phone: "" },
    { name: "ADELIA RIZKA SUWANDA, S.Pd", phone: "+62 896-9353-6750" }
  ];

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>

      {/* Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className={`flex items-center text-gray-400 hover:text-white mb-8 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Header Section */}
        <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4">Teacher Contacts</h1>
          <div className="w-24 h-px bg-white mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-lg mx-auto">
            Contact information for XI-A Bilingual Class teachers
          </p>
        </div>

        {/* Search Bar */}
        <div className={`mb-8 transform transition-all duration-1000 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search teachers..."
              className="w-full bg-black border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 transition-all pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <User className="absolute left-3 top-3.5 w-4 h-4 text-white/50" />
          </div>
        </div>

        {/* Teachers List */}
        <div className={`space-y-4 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher, index) => (
              <div 
                key={index} 
                className="border border-white/10 rounded-lg p-5 hover:border-white/20 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-light mb-1">{teacher.name}</h3>
                    {teacher.phone ? (
                      <div className="flex items-center text-gray-400 group-hover:text-white transition-colors">
                        <Phone className="w-4 h-4 mr-2" />
                        <a href={`tel:${teacher.phone.replace(/\D/g, '')}`} className="hover:underline">
                          {teacher.phone}
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Phone number not available</p>
                    )}
                  </div>
                  {teacher.phone && (
                    <a 
                      href={`https://wa.me/${teacher.phone.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1 rounded-md text-sm flex items-center transition-all"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No teachers found matching your search
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className={`mt-12 text-center text-gray-500 text-sm transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p>Use contact information responsibly</p>
          <p className="mt-1">© 2025 XI-A Bilingual Class</p>
        </div>
      </div>
    </div>
  );
}
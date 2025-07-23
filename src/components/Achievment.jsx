import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, User } from 'lucide-react';

// Sample data structure - easily editable
const achievementsData = [
  {
    name: "Fredy",
    media: [
      {
        type: "video",
        url: "https://res.cloudinary.com/dc3bfhgfd/video/upload/v1753262478/WhatsApp_Video_2025-07-23_at_16.20.25_dff14e35_abptbu.mp4",
        title: "CodeCamp Reward",
        date: "23 Juli 2025"
      }
    ]
  },
  {
    name: "Alicia",
    media: [
      {
        type: "image",
        url: "https://example.com/path-to-image.jpg",
        title: "English Speech Competition",
        date: "15 Mei 2025"
      },
      {
        type: "image",
        url: "https://example.com/path-to-image2.jpg",
        title: "Math Olympiad",
        date: "20 Juni 2025"
      }
    ]
  }
  // Add more students here
];

export default function Achievement() {
  const navigate = useNavigate();

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
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4">Achievements</h1>
          <div className="w-24 h-px bg-white mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-lg mx-auto">
            Prestasi siswa kelas XI-A Bilingual
          </p>
        </div>

        {/* Achievements List */}
        <div className="space-y-12">
          {achievementsData.map((student, studentIndex) => (
            <div key={studentIndex} className="border-b border-white/10 pb-12 last:border-b-0 last:pb-0">
              {/* Student Header */}
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 mr-3 text-white/60" />
                <h2 className="text-2xl font-light tracking-wider">{student.name}</h2>
              </div>

              {/* Media Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {student.media.map((media, mediaIndex) => (
                  <div key={mediaIndex} className="group">
                    <div className="mb-2 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                      <h3 className="text-lg font-light text-yellow-400">{media.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{media.date}</p>
                    
                    {media.type === 'video' ? (
                      <div className="relative pt-[56.25%] border border-white/20 group-hover:border-white/40 transition-all">
                        <video 
                          controls
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        >
                          <source src={media.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="relative pt-[100%] border border-white/20 group-hover:border-white/40 transition-all">
                        <img 
                          src={media.url} 
                          alt={media.title}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

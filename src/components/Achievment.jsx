import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Trophy, User } from 'lucide-react';

// Sample data structure - you can edit these
const achievementsData = [
  {
    name: "Fredy",
    media: [
      {
        type: "video",
        url: "https://res.cloudinary.com/dc3bfhgfd/video/upload/v1753262478/WhatsApp_Video_2025-07-23_at_16.20.25_dff14e35_abptbu.mp4",
        title: "CodeCamp Reward"
      }
    ]
  },
  {
    name: "Student",
    media: [
      {
        type: "image",
        url: "https://example.com/path-to-image2.jpg",
        title: "Science Fair Champion"
      }
    ]
  }
];

export default function Achievement() {
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const currentStudent = achievementsData[currentStudentIndex];
  const currentMedia = currentStudent.media[currentMediaIndex];

  const nextStudent = () => {
    setCurrentStudentIndex((prev) => 
      prev === achievementsData.length - 1 ? 0 : prev + 1
    );
    setCurrentMediaIndex(0);
  };

  const prevStudent = () => {
    setCurrentStudentIndex((prev) => 
      prev === 0 ? achievementsData.length - 1 : prev - 1
    );
    setCurrentMediaIndex(0);
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === currentStudent.media.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === 0 ? currentStudent.media.length - 1 : prev - 1
    );
  };

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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Student Info */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <User className="w-6 h-6 mr-2 text-white/60" />
            <h2 className="text-2xl md:text-3xl font-light tracking-wider">
              {currentStudent.name}
            </h2>
          </div>
          <div className="w-24 h-px bg-white mx-auto mb-4"></div>
          <div className="flex items-center justify-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            <h3 className="text-lg md:text-xl text-yellow-400 font-light">
              {currentMedia.title}
            </h3>
          </div>
        </div>

        {/* Media Display */}
        <div className="w-full max-w-3xl mb-8 relative group">
          {currentMedia.type === 'video' ? (
            <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
              <video 
                controls 
                className="absolute top-0 left-0 w-full h-full object-cover border border-white/20"
              >
                <source src={currentMedia.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="relative pt-[100%]"> {/* Square aspect ratio */}
              <img 
                src={currentMedia.url} 
                alt={currentMedia.title}
                className="absolute top-0 left-0 w-full h-full object-cover border border-white/20"
              />
            </div>
          )}

          {/* Navigation Arrows */}
          {currentStudent.media.length > 1 && (
            <>
              <button 
                onClick={prevMedia}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextMedia}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Student Navigation */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={prevStudent}
            className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-white/60">
            {currentStudentIndex + 1} / {achievementsData.length}
          </span>
          <button 
            onClick={nextStudent}
            className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

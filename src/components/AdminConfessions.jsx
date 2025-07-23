// src/components/AdminConfessions.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function AdminConfessions() {
  const navigate = useNavigate();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'confessions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const confessionsData = [];
      querySnapshot.forEach((doc) => {
        confessionsData.push({ id: doc.id, ...doc.data() });
      });
      setConfessions(confessionsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this confession?')) {
      await deleteDoc(doc(db, 'confessions', id));
    }
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

      <div className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4">Confessions</h1>
          <div className="w-24 h-px bg-white mx-auto mb-6"></div>
          <p className="text-gray-400">Admin Panel - View all confessions</p>
        </div>

        {/* Confessions List */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {confessions.map((confession) => (
              <div key={confession.id} className="border border-white/10 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded mr-2">
                      {confession.type}
                    </span>
                    {confession.name && (
                      <span className="text-sm text-yellow-400">From: {confession.name}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {confession.createdAt?.toDate()?.toLocaleString() || 'Unknown date'}
                  </span>
                </div>
                <p className="text-white/80 mb-3">{confession.message}</p>
                <button
                  onClick={() => handleDelete(confession.id)}
                  className="text-red-400 hover:text-red-300 text-sm flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

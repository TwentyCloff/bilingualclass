// src/components/Confess.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function Confess() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('class');
  const [messages, setMessages] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'confessions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'confessions'), {
        message,
        name,
        type,
        createdAt: serverTimestamp()
      });
      setMessage('');
      setName('');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error adding confession:', error);
    } finally {
      setIsSubmitting(false);
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

      <div className="relative z-10 px-6 py-20 max-w-2xl mx-auto">
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
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4">Confess</h1>
          <div className="w-24 h-px bg-white mx-auto mb-6"></div>
          <p className="text-gray-400">Share your thoughts anonymously</p>
        </div>

        {/* Confession Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <div className="group">
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
              Your Name (admin only)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 transition-all"
              placeholder="Optional"
            />
          </div>

          <div className="group">
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-black border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 transition-all"
            >
              <option value="class">Class</option>
              <option value="people">People</option>
              <option value="behave">Behavior</option>
              <option value="confess">Confession</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="group">
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-black border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 transition-all min-h-[120px]"
              placeholder="Write your confession..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg uppercase tracking-wider text-sm font-medium transition-all ${
              isSubmitting
                ? 'bg-white/10 text-white/50'
                : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/40'
            }`}
          >
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Confession
              </>
            )}
          </button>
        </form>

        {/* Recent Confessions */}
        <div className="border-t border-white/10 pt-8">
          <h2 className="text-xl font-light tracking-wider mb-6 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-white/60" />
            Recent Confessions
          </h2>
          
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="border border-white/10 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    {msg.type}
                  </span>
                  <span className="text-xs text-gray-400">
                    {msg.createdAt?.toDate()?.toLocaleString() || 'Just now'}
                  </span>
                </div>
                <p className="text-white/80">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black border border-white/20 px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
            <p className="text-white">Confession submitted anonymously!</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MessageSquare, User, Users, Hash } from 'lucide-react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function Confess() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [kelas, setKelas] = useState('X A');
  const [mention, setMention] = useState('');
  const [mentionTarget, setMentionTarget] = useState('');
  const [messages, setMessages] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate kelas options: X A - XII J
  const kelasOptions = [];
  for (let level of ['X', 'XI', 'XII']) {
    for (let kelas = 'A'; kelas <= 'J'; kelas = String.fromCharCode(kelas.charCodeAt(0) + 1)) {
      kelasOptions.push(`${level} ${kelas}`);
    }
  }

  const mentionOptions = [
    { value: '', label: 'None' },
    { value: 'people', label: 'People', icon: <User className="w-4 h-4 mr-2" /> },
    { value: 'kelas', label: 'Class', icon: <Users className="w-4 h-4 mr-2" /> },
    { value: 'other', label: 'Other', icon: <Hash className="w-4 h-4 mr-2" /> }
  ];

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
        message: message.trim(),
        name: name.trim() || 'Anonymous',
        kelas,
        mention: mention ? {
          type: mention,
          target: mentionTarget.trim()
        } : null,
        createdAt: serverTimestamp(),
        status: 'active'
      });
      
      setMessage('');
      setName('');
      setMention('');
      setMentionTarget('');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error adding confession:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>

      <div className="relative z-10 px-6 py-20 max-w-2xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4 bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
            Confess
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
          <p className="text-gray-400 font-light">Share your thoughts anonymously</p>
        </div>

        {/* Confession Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <div className="group">
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
              Your Name (Only Admin Can See)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300 backdrop-blur-sm"
              placeholder="Optional - will be anonymous to others"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                Your Class
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300 backdrop-blur-sm"
              >
                {kelasOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                Mention
              </label>
              <select
                value={mention}
                onChange={(e) => setMention(e.target.value)}
                className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300 backdrop-blur-sm"
              >
                {mentionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {mention && (
            <div className="group">
              <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                Mention Target ({mention === 'people' ? 'Person Name' : mention === 'kelas' ? 'Class' : 'Other'})
              </label>
              <input
                type="text"
                value={mentionTarget}
                onChange={(e) => setMentionTarget(e.target.value)}
                className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                placeholder={
                  mention === 'people' ? 'Who do you want to mention?' :
                  mention === 'kelas' ? 'Which class?' : 
                  'Specify your mention'
                }
              />
            </div>
          )}

          <div className="group">
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300 min-h-[120px] backdrop-blur-sm resize-none"
              placeholder="Write your confession or thoughts here..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className={`w-full flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg uppercase tracking-wider text-sm font-medium transition-all duration-300 ${
              isSubmitting
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/40 hover:shadow-lg hover:shadow-white/10'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sending...
              </>
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
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No confessions yet. Be the first to share!</p>
              </div>
            ) : (
              messages.filter(msg => msg.status !== 'deleted').map((msg) => (
                <div key={msg.id} className="border border-white/10 p-4 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                        {msg.kelas}
                      </span>
                      {msg.mention && (
                        <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                          {msg.mention.type}: {msg.mention.target}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-white/80 leading-relaxed">{msg.message}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    - Anonymous
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 border border-green-500/30 px-6 py-3 rounded-lg shadow-lg z-50 backdrop-blur-md animate-fade-in">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <p className="text-green-400">Confession submitted anonymously!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

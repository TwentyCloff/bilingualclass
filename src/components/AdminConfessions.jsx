import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, User, Filter, Trash2, Eye } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function ConfessAdmin() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Realtime messages listener with error handling
  useEffect(() => {
    const q = query(collection(db, 'confessions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() });
        });
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to realtime updates:", error);
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredMessages(messages.filter(msg => msg.status !== 'deleted'));
    } else {
      setFilteredMessages(messages.filter(msg => msg.type === selectedType && msg.status !== 'deleted'));
    }
  }, [messages, selectedType]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this confession?')) return;
    
    setDeleteLoading(id);
    try {
      // Soft delete by updating status
      await updateDoc(doc(db, 'confessions', id), {
        status: 'deleted',
        deletedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error deleting confession:', error);
    } finally {
      setDeleteLoading(null);
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

  const getTypeColor = (type) => {
    const colors = {
      class: 'text-blue-400 bg-blue-400/10',
      people: 'text-green-400 bg-green-400/10',
      behave: 'text-yellow-400 bg-yellow-400/10',
      confess: 'text-purple-400 bg-purple-400/10',
      other: 'text-gray-400 bg-gray-400/10'
    };
    return colors[type] || colors.other;
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
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4 bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
            Confessions Admin
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
          <p className="text-gray-400 font-light">Manage all confessions and messages</p>
        </div>

        {/* Stats and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black/30 border border-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-white/60 mr-3" />
              <div>
                <p className="text-2xl font-light">{messages.filter(m => m.status !== 'deleted').length}</p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">Active Confessions</p>
              </div>
            </div>
          </div>

          <div className="bg-black/30 border border-white/10 p-4 rounded-lg backdrop-blur-sm">
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
              <Filter className="w-4 h-4 inline mr-1" />
              Filter by Category
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-black/50 border border-white/20 px-3 py-2 rounded-lg focus:outline-none focus:border-white/40 transition-all"
            >
              <option value="all">All Categories</option>
              <option value="class">Class</option>
              <option value="people">People</option>
              <option value="behave">Behavior</option>
              <option value="confess">Confession</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Confessions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading confessions...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl mb-2">No confessions found</p>
              <p className="text-sm">
                {selectedType === 'all' 
                  ? 'No active confessions available.' 
                  : `No confessions found for "${selectedType}" category.`
                }
              </p>
            </div>
          ) : (
            filteredMessages.map((msg, index) => (
              <div key={msg.id} className="border border-white/10 p-6 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${getTypeColor(msg.type)}`}>
                      {msg.type}
                    </span>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      {formatDate(msg.createdAt)}
                    </span>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={deleteLoading === msg.id}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-all"
                      title="Delete confession"
                    >
                      {deleteLoading === msg.id ? (
                        <div className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-white/90 leading-relaxed mb-3">{msg.message}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center text-sm text-gray-400">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {msg.name && msg.name !== 'Anonymous' ? msg.name : 'Anonymous User'}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Eye className="w-3 h-3 mr-1" />
                    Admin View
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary at bottom */}
        {!loading && filteredMessages.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-400">
            Showing {filteredMessages.length} of {messages.filter(m => m.status !== 'deleted').length} active confessions
            {selectedType !== 'all' && ` in "${selectedType}" category`}
          </div>
        )}
      </div>
    </div>
  );
}

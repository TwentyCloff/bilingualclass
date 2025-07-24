import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Bookmark, Users, FileText, Tag, ChevronDown, ChevronRight, MessageSquare, Pin } from 'lucide-react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function Forum() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Sample categories - in a real app these would come from Firebase
  const defaultCategories = [
    { id: 'lectures', name: 'Lecture Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'groups', name: 'Group Projects', icon: <Users className="w-4 h-4" /> },
    { id: 'resources', name: 'Study Resources', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'announcements', name: 'Announcements', icon: <Pin className="w-4 h-4" /> }
  ];

  useEffect(() => {
    // Load categories from Firebase in a real app
    setCategories(defaultCategories);
    if (defaultCategories.length > 0) {
      setActiveCategory(defaultCategories[0].id);
    }

    // Simulate loading threads from Firebase
    const q = query(collection(db, 'forumThreads'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedThreads = [];
      querySnapshot.forEach((doc) => {
        loadedThreads.push({ id: doc.id, ...doc.data() });
      });
      setThreads(loadedThreads);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'forumThreads'), {
        title: newThreadTitle.trim(),
        content: newThreadContent.trim(),
        category: activeCategory,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        author: 'Anonymous', // In a real app, use authenticated user
        pinned: false,
        tags: []
      });

      setNewThreadTitle('');
      setNewThreadContent('');
      setIsCreatingThread(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating thread:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    // In a real app, this would save to Firebase
    const newCategory = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      name: newCategoryName.trim(),
      icon: <Tag className="w-4 h-4" />
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsCreatingCategory(false);
    setActiveCategory(newCategory.id);
    toggleCategory(newCategory.id);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredThreads = threads
    .filter(thread => 
      (activeCategory ? thread.category === activeCategory : true) &&
      (searchTerm ? 
        thread.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        thread.content.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
    )
    .sort((a, b) => (a.pinned === b.pinned) ? 0 : a.pinned ? -1 : 1);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>

      <div className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
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
            Class Forum
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
          <p className="text-gray-400 font-light">Collaborative notes and discussions</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="w-full lg:w-1/4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-light tracking-wider flex items-center">
                <FileText className="w-5 h-5 mr-2 text-white/60" />
                Categories
              </h2>
              <button
                onClick={() => setIsCreatingCategory(true)}
                className="text-white/50 hover:text-white transition-colors"
                title="Add Category"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Create Category Form */}
            {isCreatingCategory && (
              <form onSubmit={handleCreateCategory} className="mb-4 p-4 bg-white/5 rounded-lg">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 px-3 py-2 rounded mb-2 focus:outline-none focus:border-white/40"
                  placeholder="Category name"
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingCategory(false)}
                    className="px-3 py-1 text-sm text-white/70 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded"
                    disabled={!newCategoryName.trim()}
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            {/* Categories List */}
            <div className="border border-white/10 rounded-lg overflow-hidden">
              {categories.map((category) => (
                <div key={category.id} className="border-b border-white/5 last:border-b-0">
                  <div
                    onClick={() => toggleCategory(category.id)}
                    className={`flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors ${
                      activeCategory === category.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2 opacity-60">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    {expandedCategories[category.id] ? (
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                  
                  {expandedCategories[category.id] && (
                    <div className="bg-black/20 pl-8 pr-3 py-2">
                      {threads
                        .filter(t => t.category === category.id)
                        .slice(0, 3) // Show only 3 preview threads
                        .map(thread => (
                          <div
                            key={thread.id}
                            onClick={() => setActiveThread(thread)}
                            className={`text-sm py-1.5 px-2 rounded cursor-pointer hover:bg-white/5 truncate ${
                              activeThread?.id === thread.id ? 'text-white bg-white/10' : 'text-white/70'
                            }`}
                            title={thread.title}
                          >
                            {thread.pinned && <Pin className="w-3 h-3 inline mr-1" />}
                            {thread.title}
                          </div>
                        ))}
                      {threads.filter(t => t.category === category.id).length > 3 && (
                        <div className="text-xs text-white/50 mt-1">+{threads.filter(t => t.category === category.id).length - 3} more</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Thread List Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-light tracking-wider flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-white/60" />
                {activeCategory ? categories.find(c => c.id === activeCategory)?.name : 'All'} Threads
              </h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black/50 border border-white/20 pl-9 pr-3 py-1.5 rounded-lg text-sm focus:outline-none focus:border-white/40 w-40 md:w-56"
                    placeholder="Search threads..."
                  />
                </div>
                <button
                  onClick={() => setIsCreatingThread(true)}
                  className="flex items-center text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Thread
                </button>
              </div>
            </div>

            {/* Create Thread Form */}
            {isCreatingThread && (
              <form onSubmit={handleCreateThread} className="mb-6 border border-white/10 rounded-lg overflow-hidden">
                <div className="p-4 bg-white/5 border-b border-white/10">
                  <input
                    type="text"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 mb-3"
                    placeholder="Thread title"
                    autoFocus
                    required
                  />
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  className="w-full bg-black/30 min-h-[200px] p-4 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                  placeholder="Write your content here (supports Markdown)..."
                  required
                />
                <div className="p-3 bg-black/20 border-t border-white/10 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingThread(false)}
                    className="px-4 py-1.5 text-sm text-white/70 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !newThreadTitle.trim() || !newThreadContent.trim() || !activeCategory}
                    className={`px-4 py-1.5 text-sm rounded-lg ${
                      isSaving || !newThreadTitle.trim() || !newThreadContent.trim() || !activeCategory
                        ? 'bg-white/10 text-white/30 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isSaving ? 'Posting...' : 'Post Thread'}
                  </button>
                </div>
              </form>
            )}

            {/* Threads List */}
            {!isCreatingThread && (
              <div className="border border-white/10 rounded-lg overflow-hidden">
                {filteredThreads.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>
                      {searchTerm 
                        ? 'No threads match your search'
                        : activeCategory
                          ? `No threads in ${categories.find(c => c.id === activeCategory)?.name} yet`
                          : 'No threads yet'}
                    </p>
                    <button
                      onClick={() => setIsCreatingThread(true)}
                      className="mt-4 text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-lg transition-all duration-300 inline-flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create First Thread
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {filteredThreads.map(thread => (
                      <div
                        key={thread.id}
                        onClick={() => setActiveThread(thread)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-white/5 ${
                          activeThread?.id === thread.id ? 'bg-white/10' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium flex items-center">
                              {thread.pinned && <Pin className="w-4 h-4 mr-1.5 text-yellow-400" />}
                              {thread.title}
                            </h3>
                            <div className="flex items-center mt-1 space-x-3">
                              <span className="text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded">
                                {categories.find(c => c.id === thread.category)?.name || 'Uncategorized'}
                              </span>
                              <span className="text-xs text-white/50">
                                {thread.author} • {formatDate(thread.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {thread.tags?.map(tag => (
                              <span key={tag} className="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-white/70 line-clamp-2">
                          {thread.content.substring(0, 200)}{thread.content.length > 200 ? '...' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Success Popup */}
        {showSuccess && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 border border-green-500/30 px-6 py-3 rounded-lg shadow-lg z-50 backdrop-blur-md animate-fade-in">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <p className="text-green-400">Thread created successfully!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

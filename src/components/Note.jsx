import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FilePlus, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function Notepad() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Format options for the text editor
  const formatText = (format) => {
    const textarea = document.getElementById('note-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = content;

    switch (format) {
      case 'bold':
        newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        break;
      case 'italic':
        newText = content.substring(0, start) + `_${selectedText}_` + content.substring(end);
        break;
      case 'underline':
        newText = content.substring(0, start) + `<u>${selectedText}</u>` + content.substring(end);
        break;
      case 'bullet':
        newText = content.substring(0, start) + `\n- ${selectedText}` + content.substring(end);
        break;
      case 'numbered':
        newText = content.substring(0, start) + `\n1. ${selectedText}` + content.substring(end);
        break;
      default:
        break;
    }

    setContent(newText);
    // Set cursor position after the formatted text
    setTimeout(() => {
      textarea.selectionStart = start + (format === 'bold' ? 2 : format === 'italic' ? 1 : format === 'underline' ? 3 : 0);
      textarea.selectionEnd = end + (format === 'bold' ? 2 : format === 'italic' ? 1 : format === 'underline' ? 4 : 0);
      textarea.focus();
    }, 0);
  };

  useEffect(() => {
    const q = query(collection(db, 'notes'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedNotes = [];
      querySnapshot.forEach((doc) => {
        loadedNotes.push({ id: doc.id, ...doc.data() });
      });
      setNotes(loadedNotes);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      const noteData = {
        title: title.trim() || `Note ${new Date().toLocaleDateString()}`,
        content: content.trim(),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      if (activeNoteId) {
        // Update existing note
        await setDoc(doc(db, 'notes', activeNoteId), noteData);
      } else {
        // Create new note with date-based ID
        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const timeStr = new Date().toTimeString().split(' ')[0].replace(/:/g, '');
        const noteId = `note_${dateStr}_${timeStr}`;
        
        await setDoc(doc(db, 'notes', noteId), noteData);
        setActiveNoteId(noteId);
      }
      
      setShowSavePopup(true);
      setTimeout(() => setShowSavePopup(false), 3000);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewNote = () => {
    setTitle('');
    setContent('');
    setActiveNoteId(null);
    document.getElementById('note-content').focus();
  };

  const handleLoadNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setActiveNoteId(note.id);
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

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>

      <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
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
            Notepad
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
          <p className="text-gray-400 font-light">Write and save your notes in real-time</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Notes List */}
          <div className="w-full md:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-light tracking-wider">Your Notes</h2>
              <button
                onClick={handleNewNote}
                className="flex items-center text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all duration-300"
              >
                <FilePlus className="w-4 h-4 mr-1.5" />
                New
              </button>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-white/20 px-4 py-2 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                placeholder="Search notes..."
              />
            </div>
            
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto">
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>{searchTerm ? 'No matching notes found' : 'No notes yet. Create one!'}</p>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <div 
                      key={note.id}
                      onClick={() => handleLoadNote(note)}
                      className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all duration-300 ${
                        activeNoteId === note.id ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">{note.title}</h3>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Note Editor */}
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-light tracking-wider">
                {activeNoteId ? 'Edit Note' : 'New Note'}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !content.trim()}
                  className={`flex items-center text-sm ${
                    isSaving || !content.trim()
                      ? 'text-white/30 cursor-not-allowed'
                      : 'text-white/70 hover:text-white'
                  } bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all duration-300`}
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="border border-white/10 rounded-lg overflow-hidden">
              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/50 border-b border-white/10 px-4 py-3 focus:outline-none focus:border-white/20 focus:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                placeholder="Note title (optional)"
              />

              {/* Formatting Toolbar */}
              <div className="flex items-center space-x-1 p-2 bg-black/30 border-b border-white/10">
                <button
                  onClick={() => formatText('bold')}
                  className="p-2 rounded hover:bg-white/10 transition-colors duration-200"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('italic')}
                  className="p-2 rounded hover:bg-white/10 transition-colors duration-200"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('underline')}
                  className="p-2 rounded hover:bg-white/10 transition-colors duration-200"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-white/20 mx-1"></div>
                <button
                  onClick={() => formatText('bullet')}
                  className="p-2 rounded hover:bg-white/10 transition-colors duration-200"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('numbered')}
                  className="p-2 rounded hover:bg-white/10 transition-colors duration-200"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-white/20 mx-1"></div>
                <button
                  onClick={() => formatText('align-left')}
                  className="p-2 rounded hover:bg-white/10 transition-colors duration-200"
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('align-center')}
                  className="p-2 rounded hover:bg-white/10 transition-colors duration-200"
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('align-right')}
                  className="p-2 rounded hover:bg-white/10 transition-colors duration-200"
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              {/* Content Textarea */}
              <textarea
                id="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-black/30 min-h-[400px] p-4 focus:outline-none resize-none font-mono text-sm leading-relaxed backdrop-blur-sm"
                placeholder="Start writing your note here..."
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* Save Popup */}
        {showSavePopup && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 border border-green-500/30 px-6 py-3 rounded-lg shadow-lg z-50 backdrop-blur-md animate-fade-in">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <p className="text-green-400">Note saved successfully!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

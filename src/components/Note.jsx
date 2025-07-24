import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FilePlus, Bold, Italic, Underline, List, ListOrdered, Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Strikethrough, Subscript, Superscript } from 'lucide-react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function Note() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveAs, setShowSaveAs] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const editorRef = useRef(null);

  // Get current date in format DD-MM-YYYY
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const q = query(collection(db, 'notes'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesList = [];
      querySnapshot.forEach((doc) => {
        notesList.push({ id: doc.id, ...doc.data() });
      });
      setNotes(notesList);
    });
    return () => unsubscribe();
  }, []);

  const handleNewNote = () => {
    setActiveNote(null);
    setTitle(`Note ${getCurrentDate()}`);
    setContent('');
    setShowSaveAs(false);
    // Focus editor after a small delay to ensure it's rendered
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 100);
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      if (activeNote) {
        await setDoc(doc(db, 'notes', activeNote.id), {
          title,
          content,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'notes'), {
          title: title || `Note ${getCurrentDate()}`,
          content,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
      setShowSaveAs(false);
    }
  };

  const handleSaveAs = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'notes'), {
        title: newTitle || `Note ${getCurrentDate()}`,
        content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewTitle('');
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
      setShowSaveAs(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!activeNote) return;
    
    try {
      await deleteDoc(doc(db, 'notes', activeNote.id));
      setActiveNote(null);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setShowDeleteConfirm(false);
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

  const formatToolbarCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleEditorChange = (e) => {
    setContent(e.target.innerHTML);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertHTML', false, text);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>

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
            Notes
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
          <p className="text-gray-400 font-light">Write and save your thoughts</p>
        </div>

        {!activeNote && !showSaveAs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Note Card */}
            <div 
              onClick={handleNewNote}
              className="border-2 border-dashed border-white/20 p-8 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all duration-300 h-48"
            >
              <div className="relative group">
                <FilePlus className="w-10 h-10 text-white/50 mb-4 group-hover:text-white/80 transition-colors" />
                <span className="absolute -top-2 -right-2 bg-white/90 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold group-hover:bg-white transition-colors">
                  +
                </span>
              </div>
              <h3 className="text-lg font-medium text-white/80">New Note</h3>
              <p className="text-sm text-white/50">Create a new note</p>
            </div>

            {/* Existing Notes */}
            {notes.map((note) => (
              <div 
                key={note.id}
                onClick={() => {
                  setActiveNote(note);
                  setTitle(note.title);
                  setContent(note.content);
                }}
                className="border border-white/10 p-6 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 cursor-pointer h-48 flex flex-col"
              >
                <h3 className="text-lg font-medium text-white/90 mb-2 truncate">{note.title}</h3>
                <p className="text-white/60 mb-3 line-clamp-3 flex-grow">
                  {note.content.replace(/<[^>]*>/g, '').substring(0, 200)}
                </p>
                <div className="flex justify-between items-center text-xs text-white/40">
                  <span>Last updated: {formatDate(note.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-black/50 border border-white/20 rounded-lg overflow-hidden backdrop-blur-sm">
            {/* Editor Header */}
            <div className="border-b border-white/10 px-4 py-3 flex justify-between items-center">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="bg-transparent border-none focus:outline-none text-lg font-medium w-full"
              />
              <div className="flex space-x-2">
                {activeNote && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete note"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => {
                    setActiveNote(null);
                    setTitle('');
                    setContent('');
                    setShowSaveAs(false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                  >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-white/10 px-4 py-2 flex flex-wrap items-center gap-1">
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('bold')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('italic')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('underline')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('strikeThrough')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-px h-6 bg-white/20 mx-1"></div>
              
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('insertUnorderedList')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('insertOrderedList')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-px h-6 bg-white/20 mx-1"></div>
              
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('justifyLeft')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('justifyCenter')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('justifyRight')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('justifyFull')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Justify"
                >
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-px h-6 bg-white/20 mx-1"></div>
              
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('subscript')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Subscript"
                >
                  <Subscript className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('superscript')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Superscript"
                >
                  <Superscript className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-px h-6 bg-white/20 mx-1"></div>
              
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('undo')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatToolbarCommand('redo')}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable
              dangerouslySetInnerHTML={{ __html: content }}
              onInput={handleEditorChange}
              onPaste={handlePaste}
              className="p-6 min-h-[400px] focus:outline-none text-white/80"
              style={{ whiteSpace: 'pre-wrap' }}
              placeholder="Start typing your note here..."
            ></div>

            {/* Footer */}
            <div className="border-t border-white/10 px-4 py-3 flex justify-between items-center">
              <div className="text-xs text-white/40">
                {activeNote ? `Last updated: ${formatDate(activeNote.updatedAt)}` : 'New note'}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveAs(true)}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Save As
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !content.trim()}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                    isSaving
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/40 hover:shadow-lg hover:shadow-white/10'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save As Modal */}
        {showSaveAs && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-black border border-white/20 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium mb-4">Save As New Note</h3>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new note title"
                className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 mb-4"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveAs(false)}
                  className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAs}
                  disabled={isSaving || !content.trim()}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                    isSaving
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/40'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Save As'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-black border border-white/20 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium mb-4">Delete Note</h3>
              <p className="text-white/70 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteNote}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/30 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

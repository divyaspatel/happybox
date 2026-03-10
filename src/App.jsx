import React, { useState, useEffect } from 'react';
import { fetchNotes, updateNote, deleteNote } from './api';
import Header from './components/Header';
import BottomTabBar from './components/BottomTabBar';
import AddNoteForm from './components/AddNoteForm';
import NoteList from './components/NoteList';
import OnThisDay from './components/OnThisDay';
import About from './components/About';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteAdded = (newNote) => {
    setNotes([newNote, ...notes]);
  };

  const handleNoteUpdated = async (id, newText) => {
    try {
      const updated = await updateNote(id, newText);
      setNotes(notes.map(n => n.id === id ? { ...n, note: updated.note } : n));
    } catch (err) {
      console.error(err);
      alert('Failed to update note');
    }
  };

  const handleNoteDeleted = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete note');
    }
  };

  return (
    <div className="app-shell">
      <Header />

      <div className="tab-content">
        {activeTab === 'today' && (
          <>
            <AddNoteForm onNoteAdded={handleNoteAdded} />
            {loading ? (
              <div className="loading-state">Loading memories...</div>
            ) : (
              <OnThisDay notes={notes} />
            )}
          </>
        )}

        {activeTab === 'allHappies' && (
          <>
            {loading ? (
              <div className="loading-state">Loading memories...</div>
            ) : (
              <NoteList
                notes={notes}
                onUpdateNote={handleNoteUpdated}
                onDeleteNote={handleNoteDeleted}
              />
            )}
          </>
        )}

        {activeTab === 'about' && (
          <About />
        )}
      </div>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;

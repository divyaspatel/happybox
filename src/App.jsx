import React, { useState, useEffect } from 'react';
import { fetchNotes } from './api';
import AddNoteForm from './components/AddNoteForm';
import NoteList from './components/NoteList';
import CalendarView from './components/CalendarView';
import OnThisDay from './components/OnThisDay';
import { Heart } from 'lucide-react';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Date filter state from Calendar View
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);

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

  // derived state for filtering notes
  const displayedNotes = selectedDateFilter 
    ? notes.filter(n => n.date === selectedDateFilter)
    : notes;

  return (
    <div className="app-layout">
      {/* Sidebar Section */}
      <aside className="sidebar">
        <div className="glass-container" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
           <Heart size={48} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
           <h1 style={{ color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>Divya's Happy Box</h1>
           <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
             Log your daily gratitude, attach a memory, and smile at the past.
           </p>
        </div>
        
        <OnThisDay notes={notes} />
        <div style={{ marginTop: '2rem' }}>
          <CalendarView 
            notes={notes} 
            selectedDate={selectedDateFilter} 
            onSelectDate={setSelectedDateFilter} 
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
         <AddNoteForm onNoteAdded={handleNoteAdded} />
         
         <div style={{ marginTop: '1rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)' }}>
              {selectedDateFilter ? `Memories from ${selectedDateFilter}` : 'All Memories'}
            </h2>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading memories...</div>
            ) : (
              <NoteList notes={displayedNotes} />
            )}
         </div>
      </main>
    </div>
  );
}

export default App;

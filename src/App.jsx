import React, { useState, useEffect } from 'react';
import { fetchNotes, updateNote, deleteNote, syncPendingNotes } from './api';
import { getPendingNotes, deletePendingNote } from './offlineStore';
import Header from './components/Header';
import BottomTabBar from './components/BottomTabBar';
import AddNoteForm from './components/AddNoteForm';
import NoteList from './components/NoteList';
import OnThisDay from './components/OnThisDay';
import About from './components/About';

function App() {
  const [notes, setNotes] = useState([]);
  const [pendingNotes, setPendingNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'allHappies', 'about'
  const [syncing, setSyncing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('happybox_unlocked') === 'true';
  });

  useEffect(() => {
    loadAllNotes();
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      console.log('App is online. Triggering sync...');
      syncOfflineData();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [pendingNotes, syncing]);

  const handleUnlock = (correct) => {
    if (correct) {
      setIsUnlocked(true);
      localStorage.setItem('happybox_unlocked', 'true');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem('happybox_unlocked');
  };

  const loadAllNotes = async () => {
    setLoading(true);
    try {
      // Parallel load online and offline notes
      const [onlineData, offlineData] = await Promise.all([
        fetchNotes(),
        getPendingNotes()
      ]);
      setNotes(onlineData);
      setPendingNotes(offlineData);
      
      // If we are online, try to sync immediately
      if (navigator.onLine && offlineData.length > 0) {
        syncOfflineData(offlineData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const syncOfflineData = async () => {
    if (syncing || pendingNotes.length === 0) return;
    setSyncing(true);
    try {
      const { syncedNotes, errors } = await syncPendingNotes(pendingNotes);

      // Remove successfully synced notes from IndexedDB
      for (const item of syncedNotes) {
        await deletePendingNote(item.originalId);
        // Remove from local pending state immediately to prevent duplicates
        setPendingNotes(prev => prev.filter(p => p.id !== item.originalId));
        // Add to main notes list immediately
        setNotes(prev => [item, ...prev]);
      }

      if (errors.length > 0) {
        console.warn(`${errors.length} notes failed to sync.`);
      }
      
      // Final refresh to be absolutely sure
      const onlineNotes = await fetchNotes();
      setNotes(onlineNotes);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleNoteAdded = (newNote, isOffline = false) => {
    if (isOffline) {
      setPendingNotes([newNote, ...pendingNotes]);
    } else {
      setNotes([newNote, ...notes]);
    }
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
    // If it's a pending note (though we hide delete button for them, safeguard here)
    const isPending = pendingNotes.some(n => n.id === id);
    
    try {
      if (isPending) {
        await deletePendingNote(id);
        setPendingNotes(pendingNotes.filter(n => n.id !== id));
      } else {
        await deleteNote(id);
        setNotes(notes.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error('Deletion error:', err);
      alert('Failed to delete note. If this persists, please check your Supabase "Delete" policy.');
    }
  };

  return (
    <div className="app-shell">
      <Header />

      <div className="tab-content">
        {activeTab === 'today' && (
          <>
            <AddNoteForm 
              onNoteAdded={handleNoteAdded} 
              isUnlocked={isUnlocked} 
              onUnlock={handleUnlock}
            />
            {loading ? (
              <div className="loading-state">Loading memories...</div>
            ) : (
              <OnThisDay notes={notes} pendingNotes={pendingNotes} />
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
                pendingNotes={pendingNotes}
                onUpdateNote={handleNoteUpdated}
                onDeleteNote={handleNoteDeleted}
                isUnlocked={isUnlocked}
              />
            )}
          </>
        )}

        {activeTab === 'about' && (
          <div style={{ position: 'relative' }}>
            <About />
            {isUnlocked && (
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={handleLock}
                style={{ margin: '1rem auto', display: 'block', opacity: 0.6 }}
              >
                🔒 Lock App
              </button>
            )}
          </div>
        )}
      </div>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;

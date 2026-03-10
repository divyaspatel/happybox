import React, { useState } from 'react';
import { getImageUrl } from '../api';
import { Search } from 'lucide-react';

export default function NoteList({ notes }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter notes by search keyword
  const filteredNotes = notes.filter(n => 
    n.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Search size={20} color="var(--color-text-muted)" />
        <input 
          type="text"
          className="input-field"
          placeholder="Search memories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', background: 'transparent', padding: 0, boxShadow: 'none' }}
        />
      </div>

      {/* Grid of Notes */}
      {filteredNotes.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          {searchTerm ? 'No notes found for this search.' : 'Your box is empty. Add a note above!'}
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <div key={note.id} className="glass-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                {note.date}
              </div>
              <p style={{ whiteSpace: 'pre-wrap', flex: 1 }}>{note.note}</p>
              
              {note.images && note.images.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {note.images.map((img, i) => (
                    <img 
                      key={i} 
                      src={getImageUrl(img)} 
                      alt="Memory" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '200px', 
                        objectFit: 'cover', 
                        borderRadius: 'var(--radius-sm)'
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

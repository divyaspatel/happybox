import React, { useState, useMemo } from 'react';
import { getImageUrl } from '../api';
import { Search, Pencil, Trash2, Check, X, Clock } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function NoteList({ notes, pendingNotes = [], onUpdateNote, onDeleteNote, isUnlocked }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [filterYear, setFilterYear] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  const [deletingId, setDeletingId] = useState(null);

  // Extract unique years from notes for the year dropdown
  const availableYears = useMemo(() => {
    const years = new Set();
    notes.forEach(n => {
      try {
        const parts = n.date.split(', ');
        if (parts.length === 2) years.add(parts[1].trim());
      } catch {}
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [notes]);

  // Generate day options (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  // Filter notes
  const filteredNotes = useMemo(() => {
    const allNotes = [...pendingNotes, ...notes];
    return allNotes.filter(n => {
      // Keyword search
      if (searchTerm && !n.note.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Parse the note date "Month Day, Year"
      try {
        const parts = n.date.split(', ');
        if (parts.length !== 2) return !filterMonth && !filterDay && !filterYear;
        
        const monthDay = parts[0]; 
        const year = parts[1].trim(); 
        const [month, day] = monthDay.split(' ');
        
        if (filterMonth && month !== filterMonth) return false;
        if (filterDay && parseInt(day) !== parseInt(filterDay)) return false;
        if (filterYear && year !== filterYear) return false;
      } catch {
        return false;
      }
      
      return true;
    });
  }, [notes, pendingNotes, searchTerm, filterMonth, filterDay, filterYear]);

  const startEditing = (note) => {
    setEditingId(note.id);
    setEditText(note.note);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = (id) => {
    onUpdateNote(id, editText);
    setEditingId(null);
    setEditText('');
  };

  const handleDeleteConfirm = () => {
    onDeleteNote(deletingId);
    setDeletingId(null);
  };

  const clearFilters = () => {
    setFilterMonth('');
    setFilterDay('');
    setFilterYear('');
    setSearchTerm('');
  };

  const hasActiveFilters = filterMonth || filterDay || filterYear || searchTerm;

  return (
    <>
      {/* Search & Filter Bar */}
      <div className="glass-card search-filter-bar">
        <div className="search-row">
          <Search size={18} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search happies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-row">
          <select
            className="filter-select"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="">Month</option>
            {MONTHS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          
          <select
            className="filter-select"
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
          >
            <option value="">Day</option>
            {dayOptions.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          
          <select
            className="filter-select"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="">Year</option>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ alignSelf: 'flex-start' }}>
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', paddingLeft: '0.25rem' }}>
        {filteredNotes.length} {filteredNotes.length === 1 ? 'happy' : 'happies'} found
      </p>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-emoji">🔍</div>
          <p>{hasActiveFilters ? 'No happies match your search.' : 'Your box is empty! Start logging happies.'}</p>
        </div>
      ) : (
        <div className="notes-list">
          {filteredNotes.map(note => (
            <div key={note.id} className="glass-card note-card animate-fade-in">
              <div className="note-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="note-date">{note.date}</span>
                  {note.status === 'pending' && (
                    <span className="badge badge-pending">
                      <Clock size={10} /> Syncing...
                    </span>
                  )}
                </div>
                <div className="note-actions">
                  {editingId !== note.id && note.status !== 'pending' && isUnlocked && (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => startEditing(note)} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeletingId(note.id)} title="Delete" style={{ color: 'var(--color-danger)' }}>
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {editingId === note.id ? (
                <div>
                  <textarea
                    className="edit-textarea"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button className="btn btn-ghost btn-sm" onClick={cancelEditing}>
                      <X size={14} /> Cancel
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => saveEdit(note.id)}>
                      <Check size={14} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="note-text">{note.note}</p>
              )}
              
              {note.images && note.images.length > 0 && (
                <div className="note-images">
                  {note.images.map((img, i) => (
                    <img key={i} src={getImageUrl(img)} alt="Memory" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <DeleteConfirmModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </>
  );
}

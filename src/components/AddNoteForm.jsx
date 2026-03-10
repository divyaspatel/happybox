import React, { useState } from 'react';
import { createNote } from '../api';
import { ImagePlus, Send, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AddNoteForm({ onNoteAdded }) {
  const [note, setNote] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('You can only upload a maximum of 5 images.');
      return;
    }
    setImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim() && images.length === 0) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('note', note);
      
      const formattedDate = format(new Date(date + 'T12:00:00'), 'MMMM d, yyyy');
      formData.append('date', formattedDate);
      
      images.forEach(img => {
        formData.append('images', img);
      });
      
      const newNote = await createNote(formData);
      onNoteAdded(newNote);
      
      setNote('');
      setImages([]);
      setImagePreviews([]);
      setDate(format(new Date(), 'yyyy-MM-dd'));
    } catch (err) {
      console.error(err);
      alert('Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card add-note-form">
      <h2>✨ Log a Happy</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        <textarea
          className="input-field"
          placeholder="What made you happy today?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={loading}
          style={{ minHeight: '80px' }}
        />
        
        {imagePreviews.length > 0 && (
          <div className="image-previews">
            {imagePreviews.map((src, i) => (
              <img key={i} src={src} alt="Preview" />
            ))}
          </div>
        )}

        <div className="form-row">
          <div className="form-tools">
            <label className="btn-icon" style={{ cursor: 'pointer', position: 'relative' }}>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange}
                style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
                disabled={loading}
              />
              <ImagePlus size={18} />
            </label>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
               <Calendar size={16} style={{ position: 'absolute', left: '10px', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
               <input 
                 type="date"
                 className="input-field"
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 style={{ paddingLeft: '2.2rem', cursor: 'pointer', paddingTop: '0.5rem', paddingBottom: '0.5rem', fontSize: '0.85rem' }}
                 disabled={loading}
               />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-sm" disabled={loading || (!note.trim() && images.length === 0)}>
            {loading ? 'Saving...' : 'Drop in Box'} <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}

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
    
    // Create previews
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
      
      // Convert 'yyyy-MM-dd' to 'Month Day, Year'
      const formattedDate = format(new Date(date + 'T12:00:00'), 'MMMM d, yyyy');
      formData.append('date', formattedDate);
      
      images.forEach(img => {
        formData.append('images', img);
      });
      
      const newNote = await createNote(formData);
      onNoteAdded(newNote);
      
      // Reset form
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
    <div className="glass-card" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        Log Gratitude
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div style={{ position: 'relative' }}>
          <textarea
            className="input-field"
            placeholder="What are you grateful for today?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={loading}
          />
        </div>
        
        {imagePreviews.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {imagePreviews.map((src, i) => (
              <img 
                key={i} 
                src={src} 
                alt="Preview" 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* Image Upload Button */}
            <label className="btn-icon" style={{ cursor: 'pointer', position: 'relative' }}>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange}
                style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
                disabled={loading}
              />
              <ImagePlus size={20} />
            </label>
            
            {/* Date Picker Button styling wrapper */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
               <Calendar size={20} style={{ position: 'absolute', left: '10px', color: 'var(--color-text-muted)' }} pointerEvents="none" />
               <input 
                 type="date"
                 className="input-field"
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 style={{ paddingLeft: '2.5rem', cursor: 'pointer', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                 disabled={loading}
               />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || (!note.trim() && images.length === 0)}>
            {loading ? 'Saving...' : 'Drop in Box'} <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

import React from 'react';

export default function OnThisDay({ notes }) {
  // Get today's month and day
  const today = new Date();
  const todayMonth = today.toLocaleString('default', { month: 'long' });
  const todayDay = today.getDate(); // Numeric day

  // Filter notes that have the exact same Month and Day, but NOT the same year as today
  const onThisDayNotes = notes.filter(n => {
    // n.date is in format "Month Day, Year" eg "March 10, 2023"
    // parse it
    try {
      const parts = n.date.split(', ');
      if (parts.length !== 2) return false;
      const monthDay = parts[0]; // "March 10"
      const year = parseInt(parts[1], 10);
      
      const targetMonthDay = `${todayMonth} ${todayDay}`;
      
      return monthDay === targetMonthDay && year !== today.getFullYear();
    } catch {
      return false;
    }
  });

  if (onThisDayNotes.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(255, 229, 100, 0.4), rgba(255, 205, 130, 0.4))' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
        🌟 On This Day
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {onThisDayNotes.map(note => (
          <div key={note.id} style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
             <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
               {note.date.split(', ')[1]} {/* Just the year */}
             </div>
             <p style={{ fontSize: '0.95rem' }}>"{note.note}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

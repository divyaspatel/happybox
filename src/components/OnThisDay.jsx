import React from 'react';

export default function OnThisDay({ notes }) {
  const today = new Date();
  const todayMonth = today.toLocaleString('default', { month: 'long' });
  const todayDay = today.getDate();

  const onThisDayNotes = notes.filter(n => {
    try {
      const parts = n.date.split(', ');
      if (parts.length !== 2) return false;
      const monthDay = parts[0];
      const year = parseInt(parts[1], 10);
      const targetMonthDay = `${todayMonth} ${todayDay}`;
      return monthDay === targetMonthDay && year !== today.getFullYear();
    } catch {
      return false;
    }
  });

  if (onThisDayNotes.length === 0) {
    return (
      <div className="glass-card on-this-day">
        <h3>🌟 On This Day in Another Year....</h3>
        <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
          <p style={{ fontSize: '0.9rem' }}>No memories from this day in past years yet. Keep logging happies!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card on-this-day">
      <h3>🌟 On This Day in Another Year....</h3>
      <div className="on-this-day-scroll">
        {onThisDayNotes.map(note => (
          <div key={note.id} className="on-this-day-card">
             <div className="year-label">
               {note.date.split(', ')[1]}
             </div>
             <p>"{note.note}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

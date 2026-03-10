import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays,
  parse
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView({ notes, selectedDate, onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Parse note dates to real objects for easier comparison
  const noteDateStrings = notes.map(n => n.date); 
  // e.g. "March 10, 2026"

  const hasNoteOnDay = (dateObj) => {
    const formattedDate = format(dateObj, 'MMMM d, yyyy');
    return noteDateStrings.includes(formattedDate);
  };

  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="btn-icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={{ width: '32px', height: '32px' }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <button className="btn-icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ width: '32px', height: '32px' }}>
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
        days.push(
            <div key={i} style={{ flex: 1, textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.8rem', padding: '0.5rem 0' }}>
                {format(addDays(startDate, i), dateFormat)}
            </div>
        );
    }

    return <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.5rem' }}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, parse(selectedDate, 'MMMM d, yyyy', new Date()));
        const hasNotes = hasNoteOnDay(day);

        days.push(
          <div
            key={day}
            onClick={() => isCurrentMonth && onSelectDate(format(cloneDay, 'MMMM d, yyyy'))}
            style={{
              flex: 1,
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isCurrentMonth ? 'pointer' : 'default',
              opacity: isCurrentMonth ? 1 : 0.4,
              borderRadius: 'var(--radius-sm)',
              background: isSelected ? 'var(--color-primary)' : (hasNotes ? 'var(--color-primary-light)' : 'transparent'),
              color: isSelected || hasNotes ? '#fff' : 'var(--color-text-main)',
              fontWeight: isSelected || hasNotes ? 600 : 400,
              transition: 'var(--transition-fast)'
            }}
          >
            <span style={{ 
              width: '32px', 
              height: '32px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '50%',
              background: isSelected ? 'rgba(0,0,0,0.1)' : 'transparent'
            }}>
              {formattedDate}
            </span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} style={{ display: 'flex' }}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      {selectedDate && (
         <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button 
               className="btn" 
               style={{ background: 'rgba(255,255,255,0.5)', color: 'var(--color-primary-dark)', fontSize: '0.85rem' }}
               onClick={() => onSelectDate(null)}
            >
               Clear Date Filter
            </button>
         </div>
      )}
    </div>
  );
}

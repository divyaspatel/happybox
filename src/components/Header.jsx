import React from 'react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-sun">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="8" fill="#FFD93D" />
          <g stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="2" x2="18" y2="6" />
            <line x1="18" y1="30" x2="18" y2="34" />
            <line x1="2" y1="18" x2="6" y2="18" />
            <line x1="30" y1="18" x2="34" y2="18" />
            <line x1="6.7" y1="6.7" x2="9.5" y2="9.5" />
            <line x1="26.5" y1="26.5" x2="29.3" y2="29.3" />
            <line x1="6.7" y1="29.3" x2="9.5" y2="26.5" />
            <line x1="26.5" y1="9.5" x2="29.3" y2="6.7" />
          </g>
        </svg>
      </div>
      <h1 className="header-title">Happy Box</h1>
    </header>
  );
}

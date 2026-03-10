import React from 'react';

export default function BottomTabBar({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-tab-bar">
      <button
        className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
        onClick={() => onTabChange('today')}
      >
        {activeTab === 'today' && <CloudOutline />}
        <span className="tab-icon">☀️</span>
        <span className="tab-label">Today</span>
      </button>
      <button
        className={`tab-btn ${activeTab === 'allHappies' ? 'active' : ''}`}
        onClick={() => onTabChange('allHappies')}
      >
        {activeTab === 'allHappies' && <CloudOutline />}
        <span className="tab-icon">🌈</span>
        <span className="tab-label">All Happies</span>
      </button>
      <button
        className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
        onClick={() => onTabChange('about')}
      >
        {activeTab === 'about' && <CloudOutline />}
        <span className="tab-icon">💛</span>
        <span className="tab-label">About</span>
      </button>
    </nav>
  );
}

function CloudOutline() {
  return (
    <svg
      className="cloud-indicator-svg"
      viewBox="0 0 120 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28 58 C12 58 4 48 6 38 C2 32 2 22 12 16 C16 6 28 2 38 8 C44 2 56 0 64 6 C72 0 84 2 90 10 C100 6 112 12 114 24 C120 30 118 42 108 48 C112 56 104 62 94 58 Z"
        stroke="#4a90d9"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

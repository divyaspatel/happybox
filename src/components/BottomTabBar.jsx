import React from 'react';

export default function BottomTabBar({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-tab-bar">
      <button
        className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
        onClick={() => onTabChange('today')}
      >
        {activeTab === 'today' && <div className="cloud-indicator" />}
        <span className="tab-icon">☀️</span>
        <span className="tab-label">Today</span>
      </button>
      <button
        className={`tab-btn ${activeTab === 'allHappies' ? 'active' : ''}`}
        onClick={() => onTabChange('allHappies')}
      >
        {activeTab === 'allHappies' && <div className="cloud-indicator" />}
        <span className="tab-icon">🌈</span>
        <span className="tab-label">All Happies</span>
      </button>
    </nav>
  );
}

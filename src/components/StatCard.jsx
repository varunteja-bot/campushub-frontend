import React from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, color, gradBg }) {
  return (
    <div className="glass-card stat-card">
      <div 
        className="stat-icon-wrapper" 
        style={{ background: gradBg || 'rgba(99, 102, 241, 0.15)', color: color || '#818cf8' }}
      >
        <Icon size={24} />
      </div>
      <div className="stat-details">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {subtext && <span className="stat-subtext">{subtext}</span>}
      </div>
    </div>
  );
}

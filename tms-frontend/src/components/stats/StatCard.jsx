import React from 'react';
import '../../styles/dashboard.css';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color || '#1a237e' }}>
      <div className="stat-icon" style={{ color: color || '#1a237e' }}>{icon}</div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}

export default StatCard;


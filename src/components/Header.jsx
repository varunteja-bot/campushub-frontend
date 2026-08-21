import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ studentInfo }) {
  const { logout, user } = useAuth();

  const displayUser = user || studentInfo;

  return (
    <header className="header">
      <div className="search-box">
        <Search size={18} color="#9ca3af" />
        <input 
          type="text" 
          placeholder="Search subjects, notices, timetable..." 
          className="search-input"
        />
      </div>

      <div className="header-actions">
        <button className="icon-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>

        <div className="user-profile-btn">
          <img 
            src={displayUser.avatar || studentInfo.avatar} 
            alt={displayUser.name} 
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">{displayUser.name}</span>
            <span className="user-role">{displayUser.rollNo} • Sem {displayUser.semester}</span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="icon-btn" 
          title="Sign Out of CampusHub"
          style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.1)' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

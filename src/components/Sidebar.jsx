import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  CalendarCheck, 
  Clock, 
  Award, 
  BellRing, 
  UserCircle 
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'timetable', label: 'Timetable', icon: Clock },
  { id: 'marks', label: 'Marks & Grades', icon: Award },
  { id: 'notices', label: 'Campus Notices', icon: BellRing },
  { id: 'profile', label: 'Student Profile', icon: UserCircle },
];

export default function Sidebar({ activeTab, setActiveTab, backendStatus }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={24} />
        </div>
        <span className="brand-title">CampusHub</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} className="nav-icon" />
              <span className="nav-text">{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status-badge">
          <div className={`status-dot ${backendStatus === 'online' ? '' : 'offline'}`} />
          <span>Backend API: {backendStatus}</span>
        </div>
      </div>
    </aside>
  );
}

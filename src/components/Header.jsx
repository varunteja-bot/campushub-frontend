import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchNotices } from '../services/api';

export default function Header({ studentInfo }) {
  const { logout, user } = useAuth();

  const displayUser = user || studentInfo;

  const [showNotifications, setShowNotifications] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const notificationRef = useRef(null);

  // Load notices from backend
  const loadNotices = async () => {
    try {
      setLoadingNotices(true);

      const data = await fetchNotices();

      // In case backend returns an array directly
      setNotices(Array.isArray(data) ? data : data.notices || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoadingNotices(false);
    }
  };

  // Load notices when notification button is clicked
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);

    if (!showNotifications) {
      loadNotices();
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

        {/* Notifications */}
        <div
          ref={notificationRef}
          style={{ position: 'relative' }}
        >
          <button
            className="icon-btn"
            title="Notifications"
            onClick={handleNotificationClick}
          >
            <Bell size={20} />

            {notices.length > 0 && (
              <span className="notification-badge">
                {notices.length}
              </span>
            )}
          </button>

          {/* Notification Popup */}
          {showNotifications && (
            <div
              className="glass-card"
              style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                width: '350px',
                maxHeight: '450px',
                overflowY: 'auto',
                padding: '1rem',
                zIndex: 1000,
                boxShadow: '0 15px 40px rgba(0,0,0,0.35)'
              }}
            >
              {/* Popup Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}
              >
                <h3 style={{ margin: 0 }}>
                  Notifications
                </h3>

                <button
                  onClick={() => setShowNotifications(false)}
                  className="icon-btn"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Loading */}
              {loadingNotices && (
                <p style={{ color: 'var(--text-secondary)' }}>
                  Loading notifications...
                </p>
              )}

              {/* No Notifications */}
              {!loadingNotices && notices.length === 0 && (
                <p style={{ color: 'var(--text-secondary)' }}>
                  No notifications available.
                </p>
              )}

              {/* Notice List */}
              {!loadingNotices &&
                notices.map((notice) => (
                  <div
                    key={notice.id}
                    style={{
                      padding: '0.85rem',
                      marginBottom: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.05)',
                      border: notice.is_important
                        ? '1px solid rgba(244, 63, 94, 0.5)'
                        : '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        marginBottom: '0.35rem'
                      }}
                    >
                      {notice.title}
                    </div>

                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {notice.content}
                    </div>

                    {notice.category && (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          fontSize: '0.72rem',
                          color: 'var(--accent-indigo-light)'
                        }}
                      >
                        {notice.category}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="user-profile-btn">
          <img
            src={displayUser.avatar || studentInfo.avatar}
            alt={displayUser.name}
            className="user-avatar"
          />

          <div className="user-info">
            <span className="user-name">
              {displayUser.name}
            </span>

            <span className="user-role">
              {displayUser.rollNo} • Sem {displayUser.semester}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="icon-btn"
          title="Sign Out of CampusHub"
          style={{
            color: 'var(--accent-rose)',
            borderColor: 'rgba(244, 63, 94, 0.3)',
            background: 'rgba(244, 63, 94, 0.1)'
          }}
        >
          <LogOut size={18} />
        </button>

      </div>
    </header>
  );
}
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Calendar, Sparkles } from 'lucide-react';
import { fetchTimetable } from '../services/api';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function TimetableView() {
  const getTodayName = () => {
    const todayIndex = new Date().getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentName = dayNames[todayIndex];
    return days.includes(currentName) ? currentName : 'Monday';
  };

  const [selectedDay, setSelectedDay] = useState(getTodayName());
  const [timetable, setTimetable] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: []
  });

  const todayName = getTodayName();

  useEffect(() => {
    fetchTimetable()
      .then((data) => setTimetable(data))
      .catch((err) => console.error('Error fetching timetable from DB:', err));
  }, []);

  const activeSlots = timetable[selectedDay] || [];

  return (
    <div className="timetable-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Weekly Timetable & Schedule</h1>
          <p className="page-subtitle">Class schedule, lecture halls, and faculty allocation loaded from SQLite database.</p>
        </div>

        <div className="badge badge-indigo" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={14} />
          <span>Today is <strong>{todayName}</strong></span>
        </div>
      </div>

      {/* Day Selector Pills with Slot Count Badges */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {days.map((day) => {
          const slotCount = (timetable[day] || []).length;
          const isSelected = selectedDay === day;
          const isToday = day === todayName;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className="badge"
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-glass)',
                color: isSelected ? 'var(--accent-indigo-light)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{day}</span>
              {isToday && (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)' }} />
              )}
              <span style={{ fontSize: '0.75rem', opacity: 0.8, background: 'rgba(255, 255, 255, 0.1)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)' }}>
                {slotCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Slot Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {activeSlots.length === 0 ? (
          <div className="glass-card" style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 1.5rem' }}>
            <Calendar size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto', display: 'block' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>No lectures scheduled for {selectedDay}</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Enjoy your free day or use this time for self-study!</p>
          </div>
        ) : (
          activeSlots.map((slot, index) => (
            <div key={index} className="glass-card" style={{ borderLeft: '4px solid var(--accent-indigo-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-indigo-light)', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Clock size={16} />
                    <span>{slot.time}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.35rem' }}>{slot.subject}</h3>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={16} color="var(--accent-cyan)" />
                    <span>{slot.room}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <User size={16} color="var(--accent-purple)" />
                    <span>{slot.faculty}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

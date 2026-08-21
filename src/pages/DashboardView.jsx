import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { CalendarCheck, Award, FileText, Bell, Clock, ChevronRight, PlusCircle, Calendar } from 'lucide-react';
import { fetchStudentOverview } from '../services/api';

export default function DashboardView({ metrics: initialMetrics, studentInfo: initialStudent, onNavigate }) {
  const [data, setData] = useState({
    student: initialStudent,
    metrics: initialMetrics
  });

  useEffect(() => {
    fetchStudentOverview()
      .then((res) => {
        if (res && res.student) setData(res);
      })
      .catch((err) => console.error('Error loading overview data:', err));
  }, []);

  const student = data.student || initialStudent;
  const metrics = data.metrics || initialMetrics;

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Welcome back, {student.name.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Here is what is happening with your studies and campus updates today.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onNavigate('attendance')}
            className="badge badge-emerald"
            style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none' }}
          >
            <PlusCircle size={16} /> Quick Log Attendance
          </button>
          <button
            onClick={() => onNavigate('timetable')}
            className="badge badge-indigo"
            style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none' }}
          >
            <Calendar size={16} /> View Schedule
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard 
          label="Overall Attendance"
          value={`${metrics.overallAttendance}%`}
          subtext={metrics.overallAttendance >= 75 ? "Above 75% target threshold" : "Attention required (<75%)"}
          icon={CalendarCheck}
          color={metrics.overallAttendance >= 75 ? "#10b981" : "#f43f5e"}
          gradBg={metrics.overallAttendance >= 75 ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)"}
        />
        <StatCard 
          label="Cumulative GPA"
          value={metrics.cgpa}
          subtext="Top 10% of CSE Batch"
          icon={Award}
          color="#a855f7"
          gradBg="rgba(168, 85, 247, 0.15)"
        />
        <StatCard 
          label="Pending Assignments"
          value={metrics.pendingAssignments}
          subtext="Due within 4 days"
          icon={FileText}
          color="#f59e0b"
          gradBg="rgba(245, 158, 11, 0.15)"
        />
        <StatCard 
          label="Unread Notices"
          value={metrics.unreadNotices}
          subtext="Updated live from DB"
          icon={Bell}
          color="#6366f1"
          gradBg="rgba(99, 102, 241, 0.15)"
        />
      </div>

      {/* Dashboard Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Today's Schedule Quick View */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Monday's Classes</h3>
            <button 
              onClick={() => onNavigate('timetable')} 
              style={{ background: 'none', border: 'none', color: 'var(--accent-indigo-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
            >
              Full Schedule <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-indigo)' }}>
              <Clock size={20} color="var(--accent-indigo-light)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Data Structures & Algorithms</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>09:30 AM - 10:30 AM • Lab 304</div>
              </div>
              <span className="badge badge-indigo">Upcoming</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-emerald)' }}>
              <Clock size={20} color="var(--accent-emerald)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Database Management Systems</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>11:00 AM - 12:00 PM • Lecture Hall 2</div>
              </div>
              <span className="badge badge-emerald">Done</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-amber)' }}>
              <Clock size={20} color="var(--accent-amber)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Web Development Lab</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>02:00 PM - 04:00 PM • Software Lab 1</div>
              </div>
              <span className="badge badge-amber">Later</span>
            </div>
          </div>
        </div>

        {/* Latest Notices Quick Peek */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Important Notices</h3>
            <button 
              onClick={() => onNavigate('notices')} 
              style={{ background: 'none', border: 'none', color: 'var(--accent-indigo-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span className="badge badge-rose">Exam</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Today</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Mid-Semester Examination Schedule Released</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Final datesheets for 6th-semester lab & theory examinations are available.</div>
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span className="badge badge-indigo">Event</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Yesterday</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Annual Hackathon 2026 Registration</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Submit your team proposals before August 30th.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { API_BASE_URL } from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginView from './pages/LoginView';
import DashboardView from './pages/DashboardView';
import AttendanceView from './pages/AttendanceView';
import TimetableView from './pages/TimetableView';
import MarksView from './pages/MarksView';
import NoticesView from './pages/NoticesView';
import ProfileView from './pages/ProfileView';

function MainAppShell() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('checking...');
  
  const [studentInfo, setStudentInfo] = useState({
    name: 'Alex Johnson',
    rollNo: 'CS-2024-089',
    department: 'Computer Science & Engineering',
    semester: 6,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
  });

  const [metrics, setMetrics] = useState({
    overallAttendance: 88,
    cgpa: 3.84,
    pendingAssignments: 3,
    unreadNotices: 4
  });

  useEffect(() => {
  fetch(`${API_BASE_URL}/api/health`)
    .then((res) => res.json())
    .then((data) => setBackendStatus(data.status))
    .catch(() => setBackendStatus('offline'));

  fetch(`${API_BASE_URL}/api/student/overview`)
    .then((res) => res.json())
    .then((data) => {
      if (data.student) setStudentInfo(data.student);
      if (data.metrics) setMetrics(data.metrics);
    })
    .catch(() => {});
}, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div>Loading CampusHub Auth Session...</div>
      </div>
    );
  }

  // Show Login Page if not authenticated
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Render Full Dashboard Layout if authenticated
  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        backendStatus={backendStatus} 
      />

      <div className="main-wrapper">
        <Header studentInfo={studentInfo} />
        
        <main className="content-body">
          {activeTab === 'dashboard' && (
            <DashboardView 
              metrics={metrics} 
              studentInfo={studentInfo} 
              onNavigate={(tab) => setActiveTab(tab)} 
            />
          )}
          {activeTab === 'attendance' && <AttendanceView />}
          {activeTab === 'timetable' && <TimetableView />}
          {activeTab === 'marks' && <MarksView />}
          {activeTab === 'notices' && <NoticesView />}
          {activeTab === 'profile' && <ProfileView studentInfo={studentInfo} />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppShell />
    </AuthProvider>
  );
}

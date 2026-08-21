import React, { useState, useEffect } from 'react';
import { Award, PlusCircle, Calculator, CheckCircle2, X } from 'lucide-react';
import { fetchMarks, addSubjectMarks } from '../services/api';

export default function MarksView() {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSem, setSelectedSem] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Form states for adding/updating marks
  const [code, setCode] = useState('');
  const [subject, setSubject] = useState('');
  const [internal, setInternal] = useState('');
  const [endSem, setEndSem] = useState('');

  const loadMarks = () => {
    fetchMarks()
      .then((data) => {
        setMarksData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching marks from DB:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMarks();
  }, []);

  const handleAddMarks = async (e) => {
    e.preventDefault();
    setStatusMsg('Updating marks in database...');
    try {
      const res = await addSubjectMarks(code, subject, internal, endSem);
      setMarksData(res.marks);
      setShowModal(false);
      setCode('');
      setSubject('');
      setInternal('');
      setEndSem('');
      setStatusMsg(res.message);
      setTimeout(() => setStatusMsg(''), 3500);
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`);
    }
  };

  const totalScore = marksData.reduce((acc, curr) => acc + curr.total, 0);
  const avgPercentage = marksData.length > 0 ? (totalScore / marksData.length).toFixed(1) : 85.4;
  
  // Calculate dynamic GPA out of 4.0 based on percentage
  const calculatedGPA = ((avgPercentage / 100) * 4.0).toFixed(2);

  return (
    <div className="marks-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Academic Marks & Grades</h1>
          <p className="page-subtitle">Internal assessments, mid-terms, and semester grade breakdowns loaded from SQLite database.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="badge badge-emerald"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none' }}
        >
          <PlusCircle size={16} /> Add / Update Subject Marks
        </button>
      </div>

      {statusMsg && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '0.75rem 1rem',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid var(--accent-emerald)',
          color: 'var(--accent-emerald)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem'
        }}>
          {statusMsg}
        </div>
      )}

      {/* GPA & Performance Card */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calculated GPA (Scale 4.0)</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-purple)' }}>
              {calculatedGPA} / 4.0
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Average Semester Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-emerald)' }}>
              {avgPercentage}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Subjects Evaluated</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-cyan)' }}>
              {marksData.length} Courses
            </div>
          </div>
        </div>
      </div>

      {/* Semester Selector */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[5, 6].map((sem) => (
          <button
            key={sem}
            onClick={() => setSelectedSem(sem)}
            className={`badge ${selectedSem === sem ? 'badge-indigo' : ''}`}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              border: selectedSem === sem ? '1px solid var(--accent-indigo)' : '1px solid var(--border-color)',
              background: selectedSem === sem ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-glass)',
              color: selectedSem === sem ? 'var(--accent-indigo-light)' : 'var(--text-secondary)'
            }}
          >
            Semester {sem} Results
          </button>
        ))}
      </div>

      {/* Marks Table Card */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Semester {selectedSem} Subject Grade Breakdown
        </h3>
        
        {loading ? (
          <div style={{ color: 'var(--text-secondary)' }}>Loading marks from database...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Subject Code & Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Internal (30)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>End-Sem (70)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Total (100)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {marksData.map((m, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{m.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.code}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{m.internal} / 30</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{m.endSem} / 70</td>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>{m.total}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${m.grade === 'O' || m.grade === 'A+' ? 'badge-emerald' : m.grade === 'A' || m.grade === 'B+' ? 'badge-indigo' : 'badge-amber'}`}>
                        {m.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Marks Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '460px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add / Update Marks in DB</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMarks} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Subject Code (e.g. CS606)</label>
                <input
                  type="text" required placeholder="CS606" value={code} onChange={(e) => setCode(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Subject Title</label>
                <input
                  type="text" required placeholder="Cloud Computing & DevOps" value={subject} onChange={(e) => setSubject(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Internal (Out of 30)</label>
                  <input
                    type="number" min="0" max="30" required placeholder="28" value={internal} onChange={(e) => setInternal(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>End-Sem (Out of 70)</label>
                  <input
                    type="number" min="0" max="70" required placeholder="64" value={endSem} onChange={(e) => setEndSem(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="badge badge-emerald"
                style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none' }}
              >
                <CheckCircle2 size={18} /> Save Record to SQLite DB
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

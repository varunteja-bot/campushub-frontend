import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Search, AlertCircle, PlusCircle, X, Send } from 'lucide-react';
import { fetchNotices, postNotice } from '../services/api';

export default function NoticesView() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [author, setAuthor] = useState('Department Admin');
  const [isImportant, setIsImportant] = useState(false);

  const loadNotices = () => {
    fetchNotices()
      .then((data) => {
        setNotices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching notices from DB:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handlePostNotice = async (e) => {
    e.preventDefault();
    setStatusMsg('Publishing notice to database...');
    try {
      const res = await postNotice(title, content, category, author, isImportant);
      setNotices(res.notices);
      setShowModal(false);
      setTitle('');
      setContent('');
      setIsImportant(false);
      setStatusMsg(res.message);
      setTimeout(() => setStatusMsg(''), 3500);
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`);
    }
  };

  const filteredNotices = notices.filter((n) => {
    const matchesCategory = filter === 'All' || n.category === filter;
    const matchesSearch = searchQuery === '' || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="notices-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Campus Notice Board</h1>
          <p className="page-subtitle">Official announcements, examination circulars, and campus updates from SQLite database.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="badge badge-indigo"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none' }}
        >
          <PlusCircle size={16} /> Post Campus Notice
        </button>
      </div>

      {statusMsg && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '0.75rem 1rem',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid var(--accent-indigo)',
          color: 'var(--accent-indigo-light)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem'
        }}>
          {statusMsg}
        </div>
      )}

      {/* Search & Category Filter Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        {/* Search Bar */}
        <div className="search-box" style={{ width: '280px' }}>
          <Search size={18} color="#9ca3af" />
          <input 
            type="text" 
            placeholder="Search notices by keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {['All', 'Exams', 'Placements', 'General', 'Events'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`badge ${filter === cat ? 'badge-indigo' : ''}`}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                border: filter === cat ? '1px solid var(--accent-indigo)' : '1px solid var(--border-color)',
                background: filter === cat ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-glass)',
                color: filter === cat ? 'var(--accent-indigo-light)' : 'var(--text-secondary)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading notices from database...</div>
      ) : filteredNotices.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No announcements found matching "{searchQuery}" in category "{filter}".
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredNotices.map((n) => (
            <div key={n.id} className="glass-card" style={{ borderLeft: n.important ? '4px solid var(--accent-rose)' : '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className={`badge ${n.category === 'Exams' ? 'badge-rose' : n.category === 'Placements' ? 'badge-amber' : 'badge-indigo'}`}>
                      {n.category}
                    </span>
                    {n.important && (
                      <span className="badge badge-rose" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <AlertCircle size={12} /> URGENT
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{n.title}</h3>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={14} /> {n.date}
                </span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                {n.content}
              </p>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                Issued by: <strong style={{ color: 'var(--text-primary)' }}>{n.author}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Notice Modal */}
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
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Post Campus Notice</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePostNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Notice Headline / Title</label>
                <input
                  type="text" required placeholder="Workshop on AI & Web Development" value={title} onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Category</label>
                  <select
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  >
                    <option value="General">General</option>
                    <option value="Exams">Exams</option>
                    <option value="Placements">Placements</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Issuing Authority</label>
                  <input
                    type="text" required value={author} onChange={(e) => setAuthor(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Announcement Body</label>
                <textarea
                  rows={3} required placeholder="Enter full details of the notice..." value={content} onChange={(e) => setContent(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox" id="impCheck" checked={isImportant} onChange={(e) => setIsImportant(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent-rose)' }}
                />
                <label htmlFor="impCheck" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Flag as <strong>URGENT / High Priority Notice</strong>
                </label>
              </div>

              <button
                type="submit"
                className="badge badge-indigo"
                style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none' }}
              >
                <Send size={18} /> Publish Notice to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

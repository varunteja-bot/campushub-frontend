import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, BookOpen, GraduationCap, MapPin, Edit3, Check, X } from 'lucide-react';
import { fetchStudentProfile, updateStudentProfile } from '../services/api';

export default function ProfileView({ studentInfo: fallbackInfo }) {
  const [profile, setProfile] = useState(fallbackInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    fetchStudentProfile()
      .then((data) => {
        if (data && data.name) {
          const profileData = {
            name: data.name,
            rollNo: data.roll_no,
            department: data.department,
            semester: data.semester,
            avatar: data.avatar_url,
            phone: data.phone || '+1 (555) 234-5678',
            address: data.address || 'Room 402, Block B Hostel, Campus North'
          };
          setProfile(profileData);
          setPhoneInput(profileData.phone);
          setAddressInput(profileData.address);
        }
      })
      .catch((err) => console.error('Error fetching profile from DB:', err));
  }, [fallbackInfo]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving changes to database...');
    try {
      await updateStudentProfile(phoneInput, addressInput);
      setProfile((prev) => ({ ...prev, phone: phoneInput, address: addressInput }));
      setIsEditing(false);
      setSaveStatus('Profile updated successfully in SQLite DB!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('Failed to update profile.');
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Student Profile</h1>
          <p className="page-subtitle">Personal information, academic enrollment, and editable contact records.</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="badge badge-indigo"
          style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {isEditing ? <X size={16} /> : <Edit3 size={16} />}
          {isEditing ? 'Cancel Edit' : 'Edit Contact Info'}
        </button>
      </div>

      {saveStatus && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '0.75rem 1rem',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid var(--accent-emerald)',
          color: 'var(--accent-emerald)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem'
        }}>
          {saveStatus}
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid var(--accent-indigo)', objectFit: 'cover' }} 
          />
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profile.name}</h2>
            <div style={{ color: 'var(--accent-indigo-light)', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.1rem' }}>
              Roll Number: {profile.rollNo}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span className="badge badge-indigo">{profile.department}</span>
              <span className="badge badge-emerald">Semester {profile.semester} Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Academic Details */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap color="var(--accent-purple)" /> Academic Overview
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Degree & Major</div>
              <div style={{ fontWeight: 600 }}>Bachelor of Technology (B.Tech) - CSE</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Batch Academic Year</div>
              <div style={{ fontWeight: 600 }}>2023 - 2027</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Faculty Advisor</div>
              <div style={{ fontWeight: 600 }}>Dr. Sarah Smith (Assoc. Professor)</div>
            </div>
          </div>
        </div>

        {/* Contact Details (View or Edit Form) */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail color="var(--accent-cyan)" /> Contact Information
          </h3>

          {isEditing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Mobile Phone Number
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Campus Address
                </label>
                <textarea
                  rows={2}
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                type="submit"
                className="badge badge-emerald"
                style={{ padding: '0.6rem', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: 'none' }}
              >
                <Check size={16} /> Save Changes to DB
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--text-secondary)" />
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>University Email</div>
                  <div style={{ fontWeight: 600 }}>alex.johnson@campushub.edu</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} color="var(--text-secondary)" />
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Mobile Number</div>
                  <div style={{ fontWeight: 600 }}>{profile.phone}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={18} color="var(--text-secondary)" />
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Campus Address</div>
                  <div style={{ fontWeight: 600 }}>{profile.address}</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Edit3,
  Check,
  X
} from 'lucide-react';

import { updateStudentProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfileView({ studentInfo: fallbackInfo }) {
  const { user, token, setUser } = useAuth();

  // Use the currently logged-in user
  const [profile, setProfile] = useState(user || fallbackInfo || {});
  const [isEditing, setIsEditing] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // Update profile whenever logged-in user changes
  useEffect(() => {
    const currentProfile = user || fallbackInfo || {};

    setProfile(currentProfile);
    setPhoneInput(currentProfile.phone || '');
    setAddressInput(currentProfile.address || '');
  }, [user, fallbackInfo]);

  const handleSave = async (e) => {
    e.preventDefault();

    setSaveStatus('Saving changes...');

    try {
      await updateStudentProfile(phoneInput, addressInput, token);

      const updatedProfile = {
        ...profile,
        phone: phoneInput,
        address: addressInput
      };

      // Update ProfileView
      setProfile(updatedProfile);

      // Update AuthContext so Header also gets updated information
      setUser(updatedProfile);

      setIsEditing(false);
      setSaveStatus('Profile updated successfully!');

      setTimeout(() => {
        setSaveStatus('');
      }, 3000);

    } catch (err) {
      console.error(err);
      setSaveStatus(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="profile-page">

      {/* Page Header */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 className="page-title">Student Profile</h1>

          <p className="page-subtitle">
            Personal information, academic enrollment, and editable contact records.
          </p>
        </div>

        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setPhoneInput(profile.phone || '');
            setAddressInput(profile.address || '');
          }}
          className="badge badge-indigo"
          style={{
            padding: '0.6rem 1.25rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {isEditing ? <X size={16} /> : <Edit3 size={16} />}

          {isEditing ? 'Cancel Edit' : 'Edit Contact Info'}
        </button>
      </div>

      {/* Status Message */}
      {saveStatus && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '0.75rem 1rem',
            background: saveStatus.includes('Failed')
              ? 'rgba(244, 63, 94, 0.15)'
              : 'rgba(16, 185, 129, 0.15)',
            border: saveStatus.includes('Failed')
              ? '1px solid var(--accent-rose)'
              : '1px solid var(--accent-emerald)',
            color: saveStatus.includes('Failed')
              ? 'var(--accent-rose)'
              : 'var(--accent-emerald)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem'
          }}
        >
          {saveStatus}
        </div>
      )}

      {/* Main Profile Header */}
      <div
        className="glass-card"
        style={{ marginBottom: '2rem' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}
        >
          <img
            src={
              profile.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'
            }
            alt={profile.name || 'Student'}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '3px solid var(--accent-indigo)',
              objectFit: 'cover'
            }}
          />

          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700
              }}
            >
              {profile.name || 'Student'}
            </h2>

            <div
              style={{
                color: 'var(--accent-indigo-light)',
                fontWeight: 600,
                fontSize: '0.95rem',
                marginTop: '0.1rem'
              }}
            >
              Roll Number: {profile.rollNo || 'Not available'}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '0.5rem',
                flexWrap: 'wrap'
              }}
            >
              <span className="badge badge-indigo">
                {profile.department || 'Computer Science & Engineering'}
              </span>

              <span className="badge badge-emerald">
                Semester {profile.semester || '1'} Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}
      >

        {/* Academic Details */}
        <div className="glass-card">

          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <GraduationCap color="var(--accent-purple)" />
            Academic Overview
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              fontSize: '0.9rem'
            }}
          >

            <div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem'
                }}
              >
                Degree & Major
              </div>

              <div style={{ fontWeight: 600 }}>
                Bachelor of Technology (B.Tech) - {profile.department || 'CSE'}
              </div>
            </div>

            <div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem'
                }}
              >
                Current Semester
              </div>

              <div style={{ fontWeight: 600 }}>
                Semester {profile.semester || '1'}
              </div>
            </div>

            <div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem'
                }}
              >
                Roll Number
              </div>

              <div style={{ fontWeight: 600 }}>
                {profile.rollNo || 'Not available'}
              </div>
            </div>

          </div>
        </div>

        {/* Contact Information */}
        <div className="glass-card">

          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Mail color="var(--accent-cyan)" />
            Contact Information
          </h3>

          {isEditing ? (

            <form
              onSubmit={handleSave}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.25rem'
                  }}
                >
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
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.25rem'
                  }}
                >
                  Campus Address
                </label>

                <textarea
                  rows={3}
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
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                className="badge badge-emerald"
                style={{
                  padding: '0.6rem',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  border: 'none'
                }}
              >
                <Check size={16} />
                Save Changes
              </button>

            </form>

          ) : (

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                fontSize: '0.9rem'
              }}
            >

              {/* REAL LOGGED-IN EMAIL */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Mail size={18} color="var(--text-secondary)" />

                <div>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem'
                    }}
                  >
                    University Email
                  </div>

                  <div style={{ fontWeight: 600 }}>
                    {profile.email || 'Not available'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Phone size={18} color="var(--text-secondary)" />

                <div>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem'
                    }}
                  >
                    Mobile Number
                  </div>

                  <div style={{ fontWeight: 600 }}>
                    {profile.phone || 'Not provided'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <MapPin size={18} color="var(--text-secondary)" />

                <div>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem'
                    }}
                  >
                    Campus Address
                  </div>

                  <div style={{ fontWeight: 600 }}>
                    {profile.address || 'Not provided'}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
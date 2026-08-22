// CampusHub API Helper Service
export const API_BASE_URL = 'https://campushub-backend-scf7.onrender.com';
export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
}

export async function fetchCurrentUser(token) {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Token verification failed');
  return res.json();
}

export async function fetchStudentOverview() {
  const res = await fetch(`${API_BASE_URL}/api/student/overview`);
  return res.json();
}

export async function fetchAttendance() {
  const res = await fetch(`${API_BASE_URL}/api/attendance`);

  if (!res.ok) {
    throw new Error(`Failed to fetch attendance: ${res.status}`);
  }

  return res.json();
}

export async function markAttendance(subjectCode, status) {
  const res = await fetch(`${API_BASE_URL}/api/attendance/mark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ subjectCode, status })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to mark attendance');
  }

  return data;
}

export async function fetchTimetable() {
  const res = await fetch(`${API_BASE_URL}/api/timetable`);

  if (!res.ok) {
    throw new Error(`Failed to fetch timetable: ${res.status}`);
  }

  return res.json();
}

export async function fetchMarks() {
  const res = await fetch(`${API_BASE_URL}/api/marks`);

  if (!res.ok) {
    throw new Error(`Failed to fetch marks: ${res.status}`);
  }

  return res.json();
}

export async function addSubjectMarks(subjectCode, subjectName, internalMarks, endSemMarks) {
  const res = await fetch(`${API_BASE_URL}/api/marks/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subjectCode,
      subjectName,
      internalMarks,
      endSemMarks
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to add/update marks');
  }

  return data;
}
export async function fetchNotices() {
  const res = await fetch(`${API_BASE_URL}/api/notices`);

  if (!res.ok) {
    throw new Error(`Failed to fetch notices: ${res.status}`);
  }

  return res.json();
}

export async function postNotice(title, content, category, author, isImportant) {
  const res = await fetch(`${API_BASE_URL}/api/notices/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      content,
      category,
      author,
      isImportant
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to post notice');
  }

  return data;
}

export async function fetchStudentProfile() {
  const res = await fetch(`${API_BASE_URL}/api/student/profile`);
  return res.json();
}

export async function updateStudentProfile(phone, address) {
  const res = await fetch(`${API_BASE_URL}/api/student/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, address })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update profile');
  }

  return data;
}

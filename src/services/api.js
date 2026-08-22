// CampusHub API Helper Service

export const API_BASE_URL =
  'https://campushub-backend-1-tdl0.onrender.com';

/**
 * Safely reads the backend response.
 * Handles both JSON responses and unexpected HTML/text responses.
 */
async function handleResponse(res, defaultErrorMessage) {
  const text = await res.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.error('Backend returned non-JSON response:', text);

    throw new Error(
      `Backend returned HTML/text instead of JSON. Status: ${res.status}`
    );
  }

  if (!res.ok) {
    throw new Error(
      data.error || data.message || defaultErrorMessage
    );
  }

  return data;
}


// ==========================================
// HEALTH
// ==========================================

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);

  return handleResponse(
    res,
    'Failed to connect to backend'
  );
}


// ==========================================
// AUTHENTICATION
// ==========================================

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  return handleResponse(res, 'Login failed');
}


export async function signupUser(
  name,
  email,
  password,
  rollNo,
  department,
  semester,
  phone,
  address
) {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      email,
      password,
      rollNo,
      department,
      semester,
      phone,
      address
    })
  });

  return handleResponse(res, 'Sign up failed');
}


export async function fetchCurrentUser(token) {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return handleResponse(
    res,
    'Token verification failed'
  );
}


// ==========================================
// STUDENT OVERVIEW
// ==========================================

export async function fetchStudentOverview() {
  const res = await fetch(
    `${API_BASE_URL}/api/student/overview`
  );

  return handleResponse(
    res,
    'Failed to fetch student overview'
  );
}


// ==========================================
// ATTENDANCE
// ==========================================

export async function fetchAttendance() {
  const res = await fetch(
    `${API_BASE_URL}/api/attendance`
  );

  return handleResponse(
    res,
    'Failed to fetch attendance'
  );
}


export async function markAttendance(subjectCode, status) {
  const res = await fetch(
    `${API_BASE_URL}/api/attendance/mark`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subjectCode,
        status
      })
    }
  );

  return handleResponse(
    res,
    'Failed to mark attendance'
  );
}


// ==========================================
// TIMETABLE
// ==========================================

export async function fetchTimetable() {
  const res = await fetch(
    `${API_BASE_URL}/api/timetable`
  );

  return handleResponse(
    res,
    'Failed to fetch timetable'
  );
}


// ==========================================
// MARKS
// ==========================================

export async function fetchMarks() {
  const res = await fetch(
    `${API_BASE_URL}/api/marks`
  );

  return handleResponse(
    res,
    'Failed to fetch marks'
  );
}


export async function addSubjectMarks(
  subjectCode,
  subjectName,
  internalMarks,
  endSemMarks
) {
  const res = await fetch(
    `${API_BASE_URL}/api/marks/add`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subjectCode,
        subjectName,
        internalMarks,
        endSemMarks
      })
    }
  );

  return handleResponse(
    res,
    'Failed to add/update marks'
  );
}


// ==========================================
// NOTICES
// ==========================================

export async function fetchNotices() {
  const res = await fetch(
    `${API_BASE_URL}/api/notices`
  );

  return handleResponse(
    res,
    'Failed to fetch notices'
  );
}


export async function postNotice(
  title,
  content,
  category,
  author,
  isImportant
) {
  const res = await fetch(
    `${API_BASE_URL}/api/notices/add`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        content,
        category,
        author,
        isImportant
      })
    }
  );

  return handleResponse(
    res,
    'Failed to post notice'
  );
}


// ==========================================
// STUDENT PROFILE
// ==========================================

export async function fetchStudentProfile(token) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    `${API_BASE_URL}/api/student/profile`,
    {
      headers
    }
  );

  return handleResponse(
    res,
    'Failed to fetch student profile'
  );
}


export async function updateStudentProfile(
  phone,
  address,
  token
) {
  const res = await fetch(
    `${API_BASE_URL}/api/student/profile`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        phone,
        address
      })
    }
  );

  return handleResponse(
    res,
    'Failed to update profile'
  );
}
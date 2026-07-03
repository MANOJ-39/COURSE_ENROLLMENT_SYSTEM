const API_BASE = 'http://localhost:8080/api';

export const api = {
  // Auth
  adminLogin: (credentials: { username: string; password: string }) =>
    fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(res => res.json()),

  studentLogin: (credentials: { email: string; password: string }) =>
    fetch(`${API_BASE}/auth/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(res => res.json()),

  // Admin endpoints
  admin: {
    getStudents: (token: string) =>
      fetch(`${API_BASE}/admin/students`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => res.json()),

    addStudent: (token: string, data: { name: string; email: string; password: string }) =>
      fetch(`${API_BASE}/admin/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).then(res => res.json()),

    getCourses: (token: string) =>
      fetch(`${API_BASE}/admin/courses`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => res.json()),

    addCourse: (token: string, data: { name: string; credits: number }) =>
      fetch(`${API_BASE}/admin/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).then(res => res.json()),

    getEnrollments: (token: string) =>
      fetch(`${API_BASE}/admin/enrollments`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => res.json()),

    addEnrollment: (token: string, data: { studentId: number; courseId: number }) =>
      fetch(`${API_BASE}/admin/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).then(res => res.json()),

    updateEnrollment: (token: string, enrollmentId: number, courseId: number) =>
      fetch(`${API_BASE}/admin/enrollments/${enrollmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      }).then(res => res.json()),

    deleteEnrollment: (token: string, enrollmentId: number) =>
      fetch(`${API_BASE}/admin/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => res.json()),

    searchEnrollments: (token: string, keyword: string) =>
      fetch(`${API_BASE}/admin/enrollments/search?keyword=${keyword}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => res.json()),

    getStudentsPerCourse: (token: string) =>
      fetch(`${API_BASE}/admin/reports/students-per-course`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => res.json()),
  },

  // Student endpoints
  student: {
    getCourses: (token: string) =>
      fetch(`${API_BASE}/student/courses`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => res.json()),

    enrollInCourse: (token: string, data: { studentId: number; courseId: number }) =>
      fetch(`${API_BASE}/student/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).then(res => res.json()),

    getMyEnrollments: (token: string, studentId: number) =>
      fetch(`${API_BASE}/student/enrollments/${studentId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => res.json()),
  },
};

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API - FIXED
// ============================================
export const authAPI = {
  login: (email: string, password: string) =>    // ✅ Changed from username to email
    api.post('/auth/login', { email, password }), // ✅ Now sends email
  verify: () => api.get('/auth/verify'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// ============================================
// EVENTS API
// ============================================
export const eventsAPI = {
  getAll: (params?: { featured?: boolean; limit?: number; category?: string }) =>
    api.get('/events', { params }),
  getById: (id: number) => api.get(`/events/${id}`),
  create: (data: FormData | object) => api.post('/events', data),
  update: (id: number, data: FormData | object) => api.put(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
};

// ============================================
// CARS API
// ============================================
export const carsAPI = {
  getAll: (params?: { type?: string; status?: string; limit?: number; minPrice?: number; maxPrice?: number }) =>
    api.get('/cars', { params }),
  getById: (id: number) => api.get(`/cars/${id}`),
  create: (data: FormData | object) => api.post('/cars', data),
  update: (id: number, data: FormData | object) => api.put(`/cars/${id}`, data),
  delete: (id: number) => api.delete(`/cars/${id}`),
};

// ============================================
// TOURS API
// ============================================
export const toursAPI = {
  getAll: (params?: { featured?: boolean; limit?: number; destination?: string; minPrice?: number; maxPrice?: number }) =>
    api.get('/tours', { params }),
  getById: (id: number) => api.get(`/tours/${id}`),
  create: (data: FormData | object) => api.post('/tours', data),
  update: (id: number, data: FormData | object) => api.put(`/tours/${id}`, data),
  delete: (id: number) => api.delete(`/tours/${id}`),
};

// ============================================
// BOOKINGS API
// ============================================
export const bookingsAPI = {
  getAll: (params?: { status?: string; booking_type?: string; limit?: number }) =>
    api.get('/bookings', { params }),
  getById: (id: number) => api.get(`/bookings/${id}`),
  create: (data: object) => api.post('/bookings', data),
  update: (id: number, data: object) => api.put(`/bookings/${id}`, data),
  delete: (id: number) => api.delete(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats/overview'),
};

// ============================================
// CONTACT API
// ============================================
export const contactAPI = {
  submit: (data: object) => api.post('/contact', data),
  getAll: (params?: { status?: string; limit?: number }) =>
    api.get('/contact', { params }),
  getById: (id: number) => api.get(`/contact/${id}`),
  update: (id: number, data: object) => api.put(`/contact/${id}`, data),
  delete: (id: number) => api.delete(`/contact/${id}`),
  getUnreadCount: () => api.get('/contact/stats/unread'),
};

// ============================================
// DASHBOARD API
// ============================================
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getActivity: (limit?: number) => api.get('/dashboard/activity', { params: { limit } }),
};

// ============================================
// STAFF API (ADD THIS IF YOU NEED IT)
// ============================================
export const staffAPI = {
  getAll: (params?: { status?: string }) =>
    api.get('/staff', { params }),
  getById: (id: number) => api.get(`/staff/${id}`),
  create: (data: object) => api.post('/staff', data),
  update: (id: number, data: object) => api.put(`/staff/${id}`, data),
  delete: (id: number) => api.delete(`/staff/${id}`),
};

// ============================================
// PARTNERS API (ADD THIS IF YOU NEED IT)
// ============================================
export const partnersAPI = {
  getAll: (params?: { status?: string }) =>
    api.get('/partners', { params }),
  getById: (id: number) => api.get(`/partners/${id}`),
  create: (data: object) => api.post('/partners', data),
  update: (id: number, data: object) => api.put(`/partners/${id}`, data),
  delete: (id: number) => api.delete(`/partners/${id}`),
};

// ============================================
// TOURISM API (ADD THIS IF YOU NEED IT)
// ============================================
export const tourismAPI = {
  getAll: (params?: { status?: string; category?: string }) =>
    api.get('/tourism', { params }),
  getById: (id: number) => api.get(`/tourism/${id}`),
  create: (data: object) => api.post('/tourism', data),
  update: (id: number, data: object) => api.put(`/tourism/${id}`, data),
  delete: (id: number) => api.delete(`/tourism/${id}`),
};

export default api;
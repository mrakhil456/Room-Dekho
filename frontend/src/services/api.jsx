import axios from 'axios';

const configuredBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const API_BASE_URL = `${configuredBase}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests and handle Content-Type
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Don't override Content-Type if it's FormData (for file uploads)
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (name, email, password, role = 'tenant') =>
    api.post('/auth/register', { name, email, password, role }),
  login: (email, password, role) =>
    api.post('/auth/login', { email, password, role }),
  getCurrentUser: () =>
    api.get('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
  changeEmail: (newEmail) =>
    api.post('/auth/change-email', { newEmail }),
};

// Room endpoints
export const roomAPI = {
  getAllRooms: (params = {}) =>
    api.get('/rooms', { params }),
  getRoomsByLandlord: (landlordId) =>
    api.get('/rooms', { params: { landlord: landlordId } }),
  getRoomById: (id) =>
    api.get(`/rooms/${id}`),
  createRoom: (roomData) => {
    // Axios will set the correct multipart boundary automatically for FormData.
    return api.post('/rooms', roomData);
  },
  updateRoom: (id, roomData) =>
    api.put(`/rooms/${id}`, roomData),
  deleteRoom: (id) =>
    api.delete(`/rooms/${id}`),
  approveRoom: (id) =>
    api.post(`/rooms/${id}/approve`),
  addReview: (id, reviewData) =>
    api.post(`/rooms/${id}/reviews`, reviewData),
  getApprovedRooms: (params = {}) => api.get('/rooms', { params: { ...params, approved: true } }),
};

// User endpoints
export const userAPI = {
  getUserProfile: () =>
    api.get('/users/profile/me'),
  updateUserProfile: (userData) =>
    api.put('/users/profile/me', userData),
  updateThemePreferences: (preferences) =>
    api.put('/users/preferences/theme', preferences),
  getUser: (id) =>
    api.get(`/users/${id}`),
  // Admin endpoints
  getAllUsers: () =>
    api.get('/users'),
  deleteUser: (id) =>
    api.delete(`/users/${id}`),
  updateUserRole: (id, role) =>
    api.put(`/users/${id}/role`, { role }),
};

// Booking endpoints
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my'),
  getLandlordBookings: () => api.get('/bookings/landlord'),
  getAllBookings: () => api.get('/bookings/all'),
  updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};

export default api;

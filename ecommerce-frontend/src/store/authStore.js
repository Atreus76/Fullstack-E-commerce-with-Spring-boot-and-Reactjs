// src/store/authStore.js
import { create } from 'zustand';
import api from '../api/client';
import toast from 'react-hot-toast';
import {jwtDecode} from 'jwt-decode'; // ← We'll install this in a second

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAdmin: localStorage.getItem('role') === 'ADMIN',

  // Helper to decode user info from JWT
  setUserFromToken: (accessToken) => {
    try {
      const decoded = jwtDecode(accessToken);
      // Standard Spring Boot JWT fields
      const email = decoded.sub; // "sub" = subject = email/username
      const roles = decoded.roles || decoded.authorities || []; // could be "roles" or "authorities"

      // Extract role string
      let role = 'USER';
      if (Array.isArray(roles)) {
        const roleObj = roles.find(r => r.authority);
        role = roleObj ? roleObj.authority.replace('ROLE_', '') : 'USER';
      } else if (typeof roles === 'string') {
        role = roles.replace('ROLE_', '');
      }

      const user = { email, role };
      localStorage.setItem('role', role === 'ADMIN' ? 'ADMIN' : 'USER');

      set({ user, isAdmin: role === 'ADMIN' });
    } catch (err) {
      console.error('Failed to decode token', err);
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Decode user from token
      useAuthStore.getState().setUserFromToken(accessToken);

      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  },

  // Register → auto login
  register: async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Decode user from token
      useAuthStore.getState().setUserFromToken(accessToken);

      toast.success('Account created! Welcome!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  },

  // Logout
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      console.log('Logout error (ignore)', err);
    } finally {
      localStorage.clear();
      set({ user: null, accessToken: null, isAdmin: false });
      toast.success('Logged out');
      window.location.href = '/login';
    }
  },

  // Optional: Load user on app start (if token exists)
  init: () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      useAuthStore.getState().setUserFromToken(token);
    }
  },
}));

export default useAuthStore;
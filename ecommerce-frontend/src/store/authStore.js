import { create } from 'zustand';
import api from '../api/client';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import useCartStore from './cartStore';
import useWishlistStore from './wishlistStore';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAdmin: localStorage.getItem('role') === 'ADMIN',
  initialized: false,

  setUserFromToken: (accessToken) => {
    try {
      const decoded = jwtDecode(accessToken);
      const email = decoded.sub;
      const roles = decoded.roles || decoded.authorities || [];

      let role = 'USER';
      if (Array.isArray(roles)) {
        const roleObj = roles.find((item) => item.authority);
        role = roleObj ? roleObj.authority.replace('ROLE_', '') : 'USER';
      } else if (typeof roles === 'string') {
        role = roles.replace('ROLE_', '');
      }

      const user = { email, role };
      localStorage.setItem('role', role === 'ADMIN' ? 'ADMIN' : 'USER');
      set({ user, isAdmin: role === 'ADMIN', initialized: true });
      return user;
    } catch (err) {
      console.error('Failed to decode token', err);
      return null;
    }
  },

  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const user = useAuthStore.getState().setUserFromToken(accessToken);
      if (!user) {
        throw new Error('Failed to decode user from token');
      }

      set({ accessToken, initialized: true });
      await useWishlistStore.getState().fetchWishlistIds();
      toast.success('Welcome back!');
      return user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { accessToken, refreshToken } = res.data;
      if (!accessToken || !refreshToken) {
        throw new Error('Registration response did not include tokens');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const user = useAuthStore.getState().setUserFromToken(accessToken);
      if (!user) {
        throw new Error('Failed to decode user from token');
      }

      set({ accessToken, initialized: true });
      await useWishlistStore.getState().fetchWishlistIds();
      toast.success('Account created! Welcome!');
      return user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  },

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
      useWishlistStore.getState().clearWishlist();
      set({ user: null, accessToken: null, isAdmin: false, initialized: true });
      toast.success('Logged out');
      window.location.href = '/login';
    }
  },

  init: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ initialized: true });
      return;
    }

    const user = useAuthStore.getState().setUserFromToken(token);
    if (!user) {
      localStorage.clear();
      set({ user: null, accessToken: null, isAdmin: false, initialized: true });
      return;
    }

    try {
      await useCartStore.getState().fetchCart();
      await useWishlistStore.getState().fetchWishlistIds();
    } finally {
      set({ initialized: true });
    }
  },
}));

export default useAuthStore;
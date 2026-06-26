import { create } from 'zustand';
import toast from 'react-hot-toast';
import api from '../api/client';

const useWishlistStore = create((set, get) => ({
  ids: [],
  isLoading: false,

  fetchWishlistIds: async () => {
    if (!localStorage.getItem('accessToken')) return;
    set({ isLoading: true });
    try {
      const res = await api.get('/wishlist/ids');
      set({ ids: res.data || [] });
    } catch {
      set({ ids: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (productId) => {
    if (!localStorage.getItem('accessToken')) {
      toast.error('Please sign in to use wishlist');
      return;
    }

    const ids = get().ids;
    const exists = ids.includes(productId);
    try {
      if (exists) {
        await api.delete(`/wishlist/${productId}`);
        set({ ids: ids.filter((id) => id !== productId) });
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/wishlist/${productId}`);
        set({ ids: [...ids, productId] });
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Wishlist update failed');
    }
  },

  clearWishlist: () => set({ ids: [] }),
}));

export default useWishlistStore;

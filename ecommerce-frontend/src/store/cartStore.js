// src/store/cartStore.js
import { create } from 'zustand';
import api from '../api/client';
import toast from 'react-hot-toast';

const useCartStore = create((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,

  // Fetch cart
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/cart');
      const { items = [], total = 0 } = res.data;
      set({
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: total,
      });
    } catch (err) {
      toast.error('Failed to load cart');
    } finally {
      set({ isLoading: false });
    }
  },

  // Add to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add', { productId, quantity });
      await get().fetchCart();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add item');
    }
  },

  // Update quantity
  updateQuantity: async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put('/cart/update', { productId, quantity });
      await get().fetchCart();
      toast.success('Cart updated');
    } catch (err) {
      toast.error('Update failed');
    }
  },

  // Remove item
  removeItem: async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      await get().fetchCart();
      toast.success('Item removed');
    } catch (err) {
      toast.error('Remove failed');
    }
  },

  // Clear cart (optional)
  clearCart: async () => {
    try {
      await api.delete('/cart/clear');
      set({ items: [], totalItems: 0, totalPrice: 0 });
      toast.success('Cart cleared');
    } catch (err) {
      toast.error('Clear failed');
    }
  },
}));

export default useCartStore;
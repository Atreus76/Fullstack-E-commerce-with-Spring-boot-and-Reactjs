// src/layouts/AdminLayout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import Navigation from '../admin/Navigation';

export default function AdminLayout() {
  const { user, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
        <Navigation />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      
    </div>
  );
}
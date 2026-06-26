import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import CustomerRouters from './Routers/CustomerRouters';
import ProtectedRoute from './Routers/ProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import AdminCategories from './admin/Categories';
import AdminOrders from './admin/Orders';

function App() {
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: '#333', color: '#fff' },
        }}
      />
      <Routes>
        <Route path="/*" element={<CustomerRouters />} />
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
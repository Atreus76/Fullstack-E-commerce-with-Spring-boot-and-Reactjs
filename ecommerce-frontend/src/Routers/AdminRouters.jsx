import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from '../admin/Dashboard'
import AdminProducts from '../admin/Products'
import AdminCategories from '../admin/Categories'
import AdminLayout from '../layout/AdminLayout'

const AdminRouters = () => {
  return (
    <div>
        <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path='/dashboard' element={<AdminDashboard />} />
              <Route path="/products" element={<AdminProducts />} />
              <Route path="/categories" element={<AdminCategories />} />
  {/* <Route path="/admin/orders" element={<AdminOrders />} /> */}
            </Route>
        </Routes>
    </div>
  )
}

export default AdminRouters
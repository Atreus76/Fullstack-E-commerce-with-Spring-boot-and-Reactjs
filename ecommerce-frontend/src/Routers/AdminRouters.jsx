import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from '../admin/Dashboard'
import AdminProducts from '../admin/Products'

const AdminRouters = () => {
  return (
    <div>
        <Routes>
            <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="products" element={<AdminProducts />} />
  {/* <Route path="categories" element={<AdminCategories />} />
  <Route path="orders" element={<AdminOrders />} /> */}
</Route>
        </Routes>
    </div>
  )
}

export default AdminRouters
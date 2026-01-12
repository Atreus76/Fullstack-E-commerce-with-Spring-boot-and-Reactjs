import { useEffect, useState } from 'react'
import Navigation from './customer/components/navigation/Navigation'
import HomePage from './customer/pages/HomePage/HomePage'
import Footer from './customer/components/Footer/Footer'
import Product from './customer/components/Product/Product'
import ProductDetails from './customer/components/ProductDetails/ProductDetails'
import Cart from './customer/components/Cart/Cart'
import Checkout from './customer/components/Checkout/Checkout'
import Order from './customer/components/Order/Order'
import OrderDetails from './customer/components/Order/OrderDetails'
import { Route, Routes } from 'react-router-dom'
import CustomerRouters from './Routers/CustomerRouters'
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore'
import useCartStore from './store/cartStore'
import AdminLayout from './layout/AdminLayout'
import AdminRouters from './Routers/AdminRouters'
import AdminDashboard from './admin/Dashboard'
import AdminProducts from './admin/Products'
import AdminCategories from './admin/Categories'

function App() {
  const [count, setCount] = useState(0)
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
      <Route path='/*' element={<CustomerRouters />}/>
      <Route path='/admin' element={<AdminLayout />}>
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/products' element={<AdminProducts />} />
        <Route path='/admin/categories' element={<AdminCategories />} />
      </Route>
    </Routes>
      
      <div>
       
      </div>
   
    </>
  )
}

export default App

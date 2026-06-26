import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../customer/pages/HomePage/HomePage'
import Cart from '../customer/components/Cart/Cart'
import Navigation from '../customer/components/navigation/Navigation'
import Footer from '../customer/components/Footer/Footer'
import Product from '../customer/components/Product/Product'
import ProductDetails from '../customer/components/ProductDetails/ProductDetails'
import Checkout from '../customer/components/Checkout/Checkout'
import Order from '../customer/components/Order/Order'
import OrderDetails from '../customer/components/Order/OrderDetails'
import TestApi from '../pages/TestApi'
import Login from '../pages/Login'
import Register from '../pages/Register'
import MainLayout from '../layout/MainLayout'
import AuthLayout from '../layout/AuthLayout'
import CheckoutSuccess from '../customer/components/Checkout/CheckoutSuccess'
import Shop from '../customer/pages/Shop'
import Wishlist from '../customer/pages/Wishlist'

const CustomerRouters = () => {
  return (
    <div>
          <Routes>
        {/* All pages WITH Navigation */}
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/cart' element={<Cart />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/:orderId" element={<Checkout />} />
          <Route path='/account/order' element={<Order />} />
          <Route path='/account/order/:orderId' element={<OrderDetails />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/wishlist' element={<Wishlist />} />
        </Route>

        {/* Auth pages WITHOUT Navigation */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    <div>
        <Footer />
      </div>
    </div>
  )
}

export default CustomerRouters

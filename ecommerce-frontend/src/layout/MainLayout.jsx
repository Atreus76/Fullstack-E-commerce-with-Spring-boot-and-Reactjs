import { Outlet } from "react-router-dom"
import Navigation from "../customer/components/navigation/Navigation"
import { useEffect } from "react"
import useCartStore from "../store/cartStore"
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Outlet />  {/* This renders the child route (Home, Cart, Products, etc.) */}
      </main>
    </div>
  )
}

export default MainLayout
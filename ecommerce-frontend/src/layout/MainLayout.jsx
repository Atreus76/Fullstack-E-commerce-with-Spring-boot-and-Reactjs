import { Outlet } from "react-router-dom"
import Navigation from "../customer/components/navigation/Navigation"

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
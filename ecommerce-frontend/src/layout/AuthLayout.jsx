import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Outlet />  {/* Login or Register page */}
    </div>
  )
}

export default AuthLayout
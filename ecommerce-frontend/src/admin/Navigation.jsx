import React from 'react'
import { Link } from 'react-router-dom'


const Navigation = () => {
  return (
    <div>
        {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-700">Logged in as Admin</span>
              <Link to="/" className="text-indigo-600 hover:text-indigo-500">
                ← Back to Store
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="mt-8">
            <Link
              to="/admin"
              className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Products
            </Link>
            <Link
              to="/admin/categories"
              className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Categories
            </Link>
            <Link
              to="/admin/orders"
              className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Orders
            </Link>
          </nav>
        </aside>
        </div>
    </div>
  )
}

export default Navigation
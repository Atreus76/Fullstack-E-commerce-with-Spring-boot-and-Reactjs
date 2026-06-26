import { Outlet } from 'react-router-dom';
import Navigation from '../admin/Navigation';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
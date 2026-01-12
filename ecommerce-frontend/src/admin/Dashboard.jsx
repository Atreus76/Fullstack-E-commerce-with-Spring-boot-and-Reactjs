// src/pages/admin/Dashboard.jsx
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(res => res.data),
  });

  if (isLoading) return <div className="text-center py-12">Loading dashboard...</div>;

  const chartData = {
    labels: data.topProducts.map(p => p.name),
    datasets: [
      {
        label: 'Sales',
        data: data.topProducts.map(p => p.sales),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-xl shadow">
          <p className="text-gray-600">Total Revenue</p>
          <p className="text-4xl font-bold text-indigo-600 mt-2">
            ${data.totalRevenue}
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow">
          <p className="text-gray-600">Today's Sales</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            ${data.todaySales}
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow">
          <p className="text-gray-600">Total Orders</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {data.totalOrders}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow">
        <h3 className="text-2xl font-semibold mb-6">Top Selling Products</h3>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6">Recent Orders</h3>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map(order => (
                <tr key={order.id} className="border-t">
                  <td className="px-6 py-4">#{order.id}</td>
                  <td className="px-6 py-4">{order.customerEmail}</td>
                  <td className="px-6 py-4 font-medium">${order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
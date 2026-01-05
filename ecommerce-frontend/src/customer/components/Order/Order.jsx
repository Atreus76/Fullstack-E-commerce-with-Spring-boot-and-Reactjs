// src/pages/MyOrders.jsx
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api/client';
import useAuthStore from '../../../store/authStore';
import toast from 'react-hot-toast';

export default function Order() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/my');
      return res.data; // array of orders
    },
    enabled: !!user, // only fetch if logged in
  });

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await api.delete(`/orders/my/${orderId}`);
      toast.success('Order cancelled');
      refetch();
    } catch (err) {
      toast.error('Failed to cancel order');
    }
  };

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-xl text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
  Order placed: {order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      })
    : 'Date not available'}
</p>
                    <p className="text-lg font-semibold mt-1">Order #{order.id}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">${order.totalAmount}</p>
                    <span
                      className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${
                        order.status === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="mt-6">
  <p className="text-sm font-medium text-gray-700 mb-3">
    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
  </p>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {order.items.map((item, index) => (
      <div key={index} className="text-center">
        <img
          src={item.productImage || '/placeholder.jpg'}
          alt={item.productName}
          className="w-full h-32 object-cover rounded-lg border border-gray-200"
        />
        <p className="mt-2 text-sm font-medium text-gray-900 line-clamp-1">
          {item.productName}
        </p>
        <p className="text-sm text-gray-600">
          Qty: {item.quantity} × ${item.priceAtPurchase}
        </p>
      </div>
    ))}
  </div>
</div>

                {/* Actions */}
                <div className="mt-6 flex gap-4">
                  <Link
                    to={`/account/order/${order.id}`}
                    className="flex-1 text-center bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
                  >
                    View Details
                  </Link>

                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="px-6 py-3 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
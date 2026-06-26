import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/client';

const nextStatuses = ['PAID', 'PROCESSING', 'SHIPPED'];

const statusClass = (status) => {
  if (status === 'PAID') return 'bg-green-100 text-green-800';
  if (status === 'PROCESSING') return 'bg-blue-100 text-blue-800';
  if (status === 'SHIPPED') return 'bg-indigo-100 text-indigo-800';
  if (status === 'CANCELLED') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get('/orders/all').then((res) => res.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ orderId, status }) => api.put(`/orders/admin/${orderId}/status`, { status }),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to update order'),
  });

  const cancelOrder = useMutation({
    mutationFn: (orderId) => api.delete(`/orders/admin/${orderId}`),
    onSuccess: () => {
      toast.success('Order cancelled');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err) => toast.error(err.response?.data || 'Failed to cancel order'),
  });

  if (isLoading) return <div className="py-12 text-center">Loading orders...</div>;

  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold">Orders Management</h2>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Order</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Items</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Total</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="align-top hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium">#{order.id}</p>
                  {order.shippingAddress && (
                    <div className="mt-2 max-w-xs text-sm text-gray-600">
                      <p className="font-medium text-gray-700">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                      </p>
                      <p>{order.shippingAddress.phoneNumber}</p>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1 text-sm text-gray-700">
                    {order.items.map((item) => (
                      <p key={`${order.id}-${item.productId}`}>
                        {item.productName} x {item.quantity}
                      </p>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-indigo-600">${order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-3">
                    <select
                      disabled={order.status === 'CANCELLED'}
                      value={order.status}
                      onChange={(e) => updateStatus.mutate({ orderId: order.id, status: e.target.value })}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value={order.status}>{order.status}</option>
                      {nextStatuses
                        .filter((status) => status !== order.status)
                        .map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    {order.status !== 'CANCELLED' && (
                      <button
                        type="button"
                        onClick={() => cancelOrder.mutate(order.id)}
                        className="rounded-lg border border-red-600 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Cancel / Refund
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

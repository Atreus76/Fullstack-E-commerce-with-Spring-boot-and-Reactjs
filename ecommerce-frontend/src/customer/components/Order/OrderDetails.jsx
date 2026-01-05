// src/pages/OrderDetails.jsx
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';

export default function OrderDetails() {
  const { orderId } = useParams();

  const {
    data: order,
    isLoading,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await api.get(`/orders/my/${orderId}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-12">Loading order...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Link to="/account/order" className="text-indigo-600 hover:underline mb-8 inline-block">
        ← Back to orders
      </Link>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-600 mt-2">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-6 py-3 rounded-full text-lg font-medium ${
              order.status === 'PAID'
                ? 'bg-green-100 text-green-800'
                : order.status === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Items */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Items</h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-6">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.productName}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="font-semibold text-indigo-600 mt-2">
                      ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.totalAmount}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t">
                <span>Total</span>
                <span>${order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
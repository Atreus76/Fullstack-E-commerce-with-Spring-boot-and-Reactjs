import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';

const statusClass = (status) => {
  if (status === 'PAID') return 'bg-green-100 text-green-800';
  if (status === 'PENDING') return 'bg-yellow-100 text-yellow-800';
  if (status === 'CANCELLED') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

export default function OrderDetails() {
  const { orderId } = useParams();

  const { data: order, isLoading } = useQuery({
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
    return <div className="py-12 text-center">Order not found</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Link to="/account/order" className="mb-8 inline-block text-indigo-600 hover:underline">
        Back to orders
      </Link>

      <div className="rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>
            <p className="mt-2 text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className={`rounded-full px-6 py-3 text-lg font-medium ${statusClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Items</h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-6">
                  <img
                    src={item.productImage || '/placeholder.jpg'}
                    alt={item.productName}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{item.productName}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="mt-2 font-semibold text-indigo-600">
                      ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {order.shippingAddress && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold">Delivery Address</h2>
                <div className="rounded-lg bg-gray-50 p-6 text-gray-700">
                  <p className="font-semibold text-gray-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="mt-2">{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p className="mt-2">{order.shippingAddress.phoneNumber}</p>
                </div>
              </div>
            )}

            <div>
              <h2 className="mb-6 text-2xl font-semibold">Order Summary</h2>
              <div className="space-y-4 rounded-lg bg-gray-50 p-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.totalAmount}</span>
                </div>
                <div className="flex justify-between border-t pt-4 text-xl font-bold">
                  <span>Total</span>
                  <span>${order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import api from '../../../api/client';
import { STRIPE_PUBLISHABLE_KEY } from '../../../config/env';
import useCartStore from '../../../store/cartStore';
import CheckoutForm from './CheckoutForm';
import DeliveryAddressForm from './DeliveryAddressForm';

const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

export default function Checkout() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const initialized = useRef(false);
  const { items, totalPrice, fetchCart, isLoading: cartLoading } = useCartStore();

  const [clientSecret, setClientSecret] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [submittingAddress, setSubmittingAddress] = useState(false);

  const stripeConfigured = Boolean(STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    if (!orderId) {
      fetchCart();
    }
  }, [fetchCart, orderId]);

  useEffect(() => {
    if (!orderId || initialized.current) return;
    initialized.current = true;

    if (!stripeConfigured) {
      setLoading(false);
      toast.error('Stripe publishable key is not configured');
      return;
    }

    Promise.all([
      api.post(`/orders/${orderId}/resume-payment`),
      api.get(`/orders/my/${orderId}`),
    ])
      .then(([paymentRes, orderRes]) => {
        setClientSecret(paymentRes.data.clientSecret);
        setOrder(orderRes.data);
      })
      .catch(() => {
        toast.error('Failed to resume payment');
        navigate('/account/order');
      })
      .finally(() => setLoading(false));
  }, [navigate, orderId, stripeConfigured]);

  const handleAddressSubmit = async (shippingAddress) => {
    if (!stripeConfigured) {
      toast.error('Stripe publishable key is not configured');
      return;
    }

    const currentItems = useCartStore.getState().items;
    if (currentItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    setSubmittingAddress(true);
    try {
      const res = await api.post('/orders/create-from-cart', shippingAddress);
      setClientSecret(res.data.clientSecret);
      setOrder(res.data);
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to initialize payment');
    } finally {
      setSubmittingAddress(false);
    }
  };

  const options = useMemo(() => ({
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: { colorPrimary: '#6366f1' },
    },
  }), [clientSecret]);

  if (loading || cartLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="text-xl">Preparing checkout...</p>
      </div>
    );
  }

  if (!stripeConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          <h1 className="text-2xl font-bold">Payment is not configured</h1>
          <p className="mt-2 text-sm">
            Set VITE_STRIPE_PUBLISHABLE_KEY in the frontend environment before starting checkout.
          </p>
        </div>
      </div>
    );
  }

  const displayItems = order?.items || items.map((item) => ({
    productId: item.productId,
    productName: item.name,
    productImage: item.image,
    priceAtPurchase: item.price,
    quantity: item.quantity,
  }));
  const displayTotal = order?.totalAmount ?? totalPrice;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-10 text-4xl font-bold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          {!clientSecret ? (
            <DeliveryAddressForm onSubmit={handleAddressSubmit} submitting={submittingAddress} />
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">Payment</h2>
              <Elements key={clientSecret} stripe={stripePromise} options={options}>
                <CheckoutForm amount={displayTotal} />
              </Elements>
              <p className="mt-6 text-center text-sm text-gray-500">
                Test card: 4242 4242 4242 4242, any future date, any CVC
              </p>
            </div>
          )}
        </div>

        <aside className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Order summary</h2>
          <div className="mt-5 space-y-4">
            {displayItems.map((item) => (
              <div key={`${item.productId}-${item.productName}`} className="flex gap-4">
                <img
                  src={item.productImage || '/placeholder.jpg'}
                  alt={item.productName}
                  className="h-16 w-16 rounded-md border border-gray-200 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatMoney(Number(item.priceAtPurchase || 0) * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatMoney(displayTotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
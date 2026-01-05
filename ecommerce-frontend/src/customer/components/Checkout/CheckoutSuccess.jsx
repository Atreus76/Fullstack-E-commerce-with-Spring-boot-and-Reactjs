// src/pages/CheckoutSuccess.jsx
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCartStore from '../../../store/cartStore';

export default function CheckoutSuccess() {
  const { state } = useLocation();
  const paymentIntent = state?.paymentIntent;
  useEffect(() => {
    useCartStore.getState().fetchCart();
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Payment Successful!
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Thank you for your purchase. Your order is being processed.
      </p>

      {paymentIntent && (
        <p className="text-sm text-gray-500 mb-8">
          Order ID: {paymentIntent.id}
        </p>
      )}

      <div className="space-x-4">
        <Link
          to="/account/order"
          className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700"
        >
          View Orders
        </Link>
        <Link
          to="/"
          className="inline-block text-indigo-600 hover:underline"
        >
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}
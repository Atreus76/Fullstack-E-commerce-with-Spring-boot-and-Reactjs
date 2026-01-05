// src/pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/client';
import useCartStore from '../../../store/cartStore';
import toast from 'react-hot-toast';
import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51SaFPmLoy0wqybSZQrz6DoMQPhT8ptcnDtnYZOZqr0A96rHuT6NR8cmM2nqMKNAjdgJlk0n330yvSagaMML6TYzV00vUwtsGkA')
export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);

  // Create order and get clientSecret
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    api.post('/orders/create-from-cart')
      .then((res) => {
        console.log("REsponse: ", res.data)
        setClientSecret(res.data.clientSecret);
        setLoading(false);
      })
      .catch((err) => {
        toast.error('Failed to initialize payment');
        navigate('/cart');
      });
  }, [items, navigate]);

  if (loading) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 text-center">
      <p className="text-xl">Initializing secure payment...</p>
    </div>
  );
}

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: { colorPrimary: '#6366f1' },
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          {/* ... same as before */}
        </div>

        {/* Payment */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Payment</h2>
          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm />
            </Elements>
          )}

          <p className="text-sm text-gray-500 mt-8 text-center">
            Test card: 4242 4242 4242 4242 • Any future date • Any CVC
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required',
    });

    if (error) {
      const errorMessage = error.message || 'Payment failed';
      setMessage(errorMessage);
      toast.error(errorMessage);
    } else {
      toast.success('Payment successful!');
      navigate('/checkout/success');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-lg bg-indigo-600 py-4 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${Number(amount || 0).toFixed(2)}`}
      </button>

      {message && <p className="text-center text-red-600">{message}</p>}
    </form>
  );
};

export default CheckoutForm;
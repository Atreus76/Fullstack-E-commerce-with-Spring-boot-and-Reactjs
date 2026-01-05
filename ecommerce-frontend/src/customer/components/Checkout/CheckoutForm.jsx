import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCartStore from '../../../store/cartStore';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCartStore();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!stripe || !elements) return;
        setLoading(true);
        
        const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        
      },
      redirect: 'if_required',
    });

      if (error) {
      setMessage(error.message || 'Payment failed');
      toast.error(error.message || 'Payment failed');
    } else {
      await clearCart();
      toast.success('Payment successful!');
      // If redirect not used, handle success here
      navigate('/checkout/success');
    }

        setLoading(false);
    };
  return (
    <div>
        <form onSubmit={handleSubmit} className="space-y-8">
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
      </button>

      {message && <p className="text-red-600 text-center">{message}</p>}
    </form>
    </div>
  )
}

export default CheckoutForm
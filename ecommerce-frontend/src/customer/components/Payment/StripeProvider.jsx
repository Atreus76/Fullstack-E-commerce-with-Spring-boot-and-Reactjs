import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe('pk_test_51YOURPUBLISHABLEKEYHERE');

export default function StripeProvider({ children }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#6366f1', // indigo-600
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
// src/components/cart/CartSummary.jsx
import { Box, Typography, Button, Divider } from '@mui/material';

const CartSummary = ({ subtotal, shipping, total, onCheckout, loading }) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Order Summary
      </Typography>
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography>Subtotal</Typography>
        <Typography>${subtotal}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography>Shipping</Typography>
        <Typography color={shipping === 0 ? 'success.main' : ''}>
          {shipping === 0 ? 'Free' : '$'+shipping}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h6" fontWeight="bold">Total</Typography>
        <Typography variant="h6" fontWeight="bold" color="primary">
          ${total}
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={onCheckout}
        disabled={loading}
        sx={{ py: 1.8, borderRadius: 9999, fontSize: '1.1rem' }}
      >
        {loading ? 'Processing...' : 'Proceed to payment'}
      </Button>
    </Box>
  );
};

export default CartSummary;
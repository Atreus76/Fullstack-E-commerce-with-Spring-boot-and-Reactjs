// src/pages/Cart.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  useCartStore  from '../../../store/cartStore';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { Container, Typography, Grid, Button } from '@mui/material';

const Cart = () => {
  const navigate = useNavigate();
  const { removeItem, updateQuantity, clearCart } = useCartStore();
  const { items = [] } = useCartStore();

  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;
  // console.log('Cart items:', items);

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => navigate('/checkout'), 600);
  };

  if (items.length === 0) {
    // ... (giữ nguyên empty state như trước)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Giỏ hàng ({items.length})
      </Typography>

      <Grid container spacing={5}>
        <Grid item xs={12} md={8}>
          {items.map(item => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onCheckout={handleCheckout}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
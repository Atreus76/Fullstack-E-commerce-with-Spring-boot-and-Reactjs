// src/components/cart/CartSummary.jsx
import { Box, Typography, Button, Divider } from '@mui/material';

const CartSummary = ({ subtotal, shipping, total, onCheckout, loading }) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Tóm tắt đơn hàng
      </Typography>
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography>Tạm tính</Typography>
        <Typography>{subtotal.toLocaleString('vi-VN')} ₫</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography>Phí vận chuyển</Typography>
        <Typography color={shipping === 0 ? 'success.main' : ''}>
          {shipping === 0 ? 'Miễn phí' : shipping.toLocaleString('vi-VN') + ' ₫'}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h6" fontWeight="bold">Tổng cộng</Typography>
        <Typography variant="h6" fontWeight="bold" color="primary">
          {total.toLocaleString('vi-VN')} ₫
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
        {loading ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
      </Button>
    </Box>
  );
};

export default CartSummary;
// src/components/cart/CartItem.jsx
import { Box, Typography, IconButton, CardMedia } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 3, 
      py: 3, 
      borderBottom: '1px solid #eee',
      '&:last-child': { borderBottom: 'none' }
    }}>
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 2 }}
        image={item.image || '/placeholder.jpg'}
        alt={item.name}
      />

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>{item.name}</Typography>
        <Typography color="primary" fontWeight="bold">
          ${item.price}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <IconButton size="small" onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>
            <Remove />
          </IconButton>
          <Typography sx={{ minWidth: 30, textAlign: 'center' }}>{item.quantity}</Typography>
          <IconButton size="small" onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}>
            <Add />
          </IconButton>

          <IconButton 
            color="error" 
            onClick={() => onRemove(item.productId)}
            sx={{ ml: 'auto' }}
          >
            <Delete />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          ${(item.price * item.quantity)}
        </Typography>
      </Box>
    </Box>
  );
};

export default CartItem;
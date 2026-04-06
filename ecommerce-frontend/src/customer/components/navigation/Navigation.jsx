import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import  useCartStore  from '../../../store/cartStore';

import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  InputBase,
  Box,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import {
  ShoppingCart,
  AccountCircle,
  Menu as MenuIcon,
  Search as SearchIcon,
  FavoriteBorder,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cartItems } = useCartStore();   // cartItems là array

  const [searchTerm, setSearchTerm] = useState('');
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cartItems?.length || 0;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleUserMenuOpen = (event) => setUserAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/login');
  };

  // Mobile menu items
  const mobileMenuItems = [
    { text: 'Home', path: '/' },
    { text: 'Shop', path: '/shop' },
    { text: 'Categories', path: '/categories' },
    { text: 'Contact', path: '/contact' },
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1 }}>
      <Toolbar sx={{ maxWidth: '1400px', mx: 'auto', width: '100%', px: { xs: 2, md: 4 } }}>
        
        {/* Logo */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          mr={40}
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          ShopVibe
        </Typography>

        {/* Search Bar - Desktop */}
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: 520,
            mx: { xs: 2, md: 6 },
            display: { xs: 'none', md: 'flex' },
            bgcolor: '#f5f5f5',
            borderRadius: '9999px',
            px: 3,
            py: 1,
            alignItems: 'center',
            border: '1px solid #e0e0e0',
          }}
        >
          <SearchIcon sx={{ color: 'gray', mr: 1 }} />
          <InputBase
            placeholder="Tìm kiếm sản phẩm..."
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </Box>

        {/* Right side icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          
          {/* Wishlist */}
          <IconButton component={Link} to="/wishlist" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <FavoriteBorder />
          </IconButton>

          {/* Cart */}
          <IconButton onClick={() => navigate('/cart')}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* User */}
          <div className="hidden lg:flex lg:items-center lg:justify-end lg:gap-x-6">
                  {user ? (
                    <div className="flex items-center gap-x-4">
                      {/* Avatar + Name */}
                      <div className="flex items-center gap-x-3">
                        {/* Simple Avatar (initials) */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Hi, {user.email.split("@")[0]}
                          </p>
                          <Link
                            to="/account/order"
                            className="text-xs text-indigo-600 hover:text-indigo-500"
                          >
                            My Orders
                          </Link>
                        </div>
                      </div>

                      {/* Logout */}
                      <button
                        onClick={logout}
                        className="text-sm font-medium text-gray-700 hover:text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Sign in
                      </Link>
                      <span className="text-gray-300">|</span>
                      <Link
                        to="/register"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </div>
          

          {/* Hamburger - Mobile */}
          <IconButton
            sx={{ display: { md: 'none' } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Search */}
      <Box sx={{ px: 2, pb: 2, display: { md: 'none' } }}>
        <Box sx={{ bgcolor: '#f5f5f5', borderRadius: '9999px', px: 3, py: 1, display: 'flex', alignItems: 'center' }}>
          <SearchIcon sx={{ color: 'gray', mr: 1 }} />
          <InputBase
            placeholder="Tìm kiếm sản phẩm..."
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </Box>
      </Box>

      {/* Mobile Drawer Menu */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }}>
          <List>
            {mobileMenuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            {!isAuthenticated && (
              <ListItem button component={Link} to="/login" onClick={() => setMobileOpen(false)}>
                <ListItemText primary="Đăng nhập" />
              </ListItem>
            )}
            
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
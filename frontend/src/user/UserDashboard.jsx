// BookingsContext to provide bookings to BookingPage
const BookingsContext = React.createContext([]);
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, AppBar, Toolbar, 
  Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Card, CardContent, CardMedia, Chip, TextField, 
  InputAdornment, Badge, Alert, Snackbar, Avatar, 
  Paper, Stepper, Step, StepLabel, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Menu, MenuItem, Dialog, DialogTitle, DialogContent, 
  DialogActions, Rating, Grid, IconButton, Divider, 
  Tabs, Tab, FormControl, InputLabel, Select, Collapse
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/RestaurantMenu';
import EventIcon from '@mui/icons-material/Event';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import ReviewsIcon from '@mui/icons-material/Reviews';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const drawerWidth = 280;

const navItems = [
  { label: 'Home', icon: <DashboardIcon />, value: 0 },
  { label: 'Menu', icon: <MenuIcon />, value: 1 },
  { label: 'Bookings', icon: <EventIcon />, value: 2 },
  { label: 'Cart', icon: <ShoppingCartIcon />, value: 3 },
  { label: 'Orders', icon: <AssignmentIcon />, value: 4 },
  { label: 'Profile', icon: <PersonIcon />, value: 5 },
  { label: 'Reviews', icon: <ReviewsIcon />, value: 6 },
];

const UserDashboard = () => {
  const [activePage, setActivePage] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, activeOrders: 0, totalSpent: 0, reviewsCount: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState({});
  const [uploading, setUploading] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [menuRes, ordersRes, bookingsRes, reviewsRes, profileRes] = await Promise.all([
        axiosInstance.get('/menu'),
        axiosInstance.get('/orders'),
        axiosInstance.get('/bookings'),
        axiosInstance.get('/reviews'),
        axiosInstance.get('/users/profile')
      ]);
      
      setMenu(menuRes.data);
      setOrders(ordersRes.data);
      setBookings(bookingsRes.data);
      setReviews(reviewsRes.data);
      setProfile(profileRes.data);

      // Calculate stats
      const totalBookings = bookingsRes.data.length;
      const activeOrders = ordersRes.data.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length;
      const totalSpent = ordersRes.data.reduce((sum, o) => sum + (o.total || 0), 0);
      const reviewsCount = reviewsRes.data.length;

      setStats({ totalBookings, activeOrders, totalSpent, reviewsCount });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      if (exists) {
        return prev.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    handleSnackbar('Item added to cart!');
  };

  const handleUpdateQuantity = (itemId, change) => {
    setCart(prev => {
      const found = prev.find(item => item._id === itemId);
      if (!found) return prev;
      
      const newQty = found.qty + change;
      if (newQty <= 0) {
        return prev.filter(item => item._id !== itemId);
      }
      return prev.map(item => item._id === itemId ? { ...item, qty: newQty } : item);
    });
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item._id !== itemId));
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cart.map(item => ({ menuItem: item._id, quantity: item.qty })),
        total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
      };
      await axiosInstance.post('/orders', orderData);
      handleSnackbar('Order placed successfully!', 'success');
      setCart([]);
      fetchDashboardData();
      setActivePage(4); // Navigate to Orders
    } catch (error) {
      handleSnackbar('Failed to place order', 'error');
    }
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      const res = await axiosInstance.post('/bookings', bookingData);
      handleSnackbar(res.data?.message || 'Booking successful 🎉');
      fetchDashboardData();
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to submit booking';
      handleSnackbar(msg, 'error');
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await axiosInstance.post('/reviews', reviewData);
      handleSnackbar('Review submitted successfully!');
      fetchDashboardData();
    } catch (error) {
      handleSnackbar('Failed to submit review', 'error');
    }
  };

  const handleDownloadInvoice = (orderId) => {
    window.open(`${axiosInstance.defaults.baseURL}/orders/${orderId}/invoice`, '_blank');
  };

  // Payment handler
  const handlePayNow = async (orderId) => {
    try {
      // Simulate payment API call
      await axiosInstance.post(`/orders/${orderId}/pay`);
      // Update local selectedOrder status to Paid for immediate UI feedback
      setSelectedOrder(prev => ({ ...prev, status: 'Paid' }));
      handleSnackbar('Payment successful! Receipt generated.', 'success');
      fetchDashboardData();
      setShowReceipt(true);
    } catch (error) {
      handleSnackbar('Payment failed. Please try again.', 'error');
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowReceipt(false);
    setOrderDialogOpen(true);
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <BookingsContext.Provider value={bookings}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#0F172A',
            borderRight: 'none',
          },
        }}
      >
        <Toolbar sx={{ bgcolor: '#0F172A', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
            FoodServe
          </Typography>
        </Toolbar>
        <Divider />
        <List sx={{ mt: 2 }}>
          {navItems.map((item) => (
            <ListItem
              key={item.value}
              onClick={() => setActivePage(item.value)}
              sx={{
                mb: 0.5,
                mx: 1,
                borderRadius: 2,
                bgcolor: activePage === item.value ? '#3B82F6' : 'transparent',
                color: activePage === item.value ? 'white' : 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  bgcolor: activePage === item.value ? '#3B82F6' : 'rgba(59, 130, 246, 0.1)',
                },
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{ fontWeight: activePage === item.value ? 600 : 400 }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Top AppBar */}
        <AppBar position="fixed" sx={{ bgcolor: 'white', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', zIndex: 1201 }}>
          <Toolbar sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: 64,
            px: 3,
            width: '100%',
            position: 'relative',
            flexWrap: 'nowrap',
          }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: '#1E293B', flex: '0 1 auto', minWidth: 120 }}
              noWrap
            >
              {navItems.find(item => item.value === activePage)?.label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, minWidth: 0, ml: 'auto' }}>
              <Badge badgeContent={5} color="error">
                <IconButton size="large">
                  <NotificationsIcon sx={{ color: '#1E293B' }} />
                </IconButton>
              </Badge>
              <Box onClick={handleMenuClick} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', minWidth: 0 }}>
                <Avatar sx={{ bgcolor: '#3B82F6', width: 36, height: 36 }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Typography sx={{ color: '#1E293B', fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }} noWrap>
                  {user?.name || 'User'}
                </Typography>
              </Box>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
  <Box sx={{ p: 4, maxWidth: '1400px', mx: 'auto', pt: { xs: 10, sm: 10, md: 12 } }}>
          {activePage === 0 && <HomePage stats={stats} menu={menu} orders={orders} profile={profile} onNavigate={setActivePage} onAddToCart={handleAddToCart} />}
          {activePage === 1 && <MenuPage menu={menu} cart={cart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onAddToCart={handleAddToCart} onNavigate={setActivePage} />}
          {activePage === 2 && <BookingPage onBookingSubmit={handleBookingSubmit} />}
          {activePage === 3 && <CartPage cart={cart} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveFromCart} totalAmount={totalAmount} onCheckout={handleCheckout} onNavigate={setActivePage} />}
          {activePage === 4 && <OrdersPage orders={orders} onViewDetails={handleViewOrderDetails} onDownloadInvoice={handleDownloadInvoice} />}
          {activePage === 5 && <ProfilePage profile={profile} uploading={uploading} setUploading={setUploading} />}
          {activePage === 6 && <ReviewsPage reviews={reviews} onReviewSubmit={handleReviewSubmit} />}
        </Box>
      </Box>

      {/* Order Details Dialog */}
      <Dialog open={orderDialogOpen} onClose={() => setOrderDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
                Order #{selectedOrder._id?.slice(-8).toUpperCase()}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </Typography>
              <Typography gutterBottom>
                Status: <Chip label={selectedOrder.status} size="small" color={selectedOrder.status === 'Paid' ? 'success' : 'primary'} />
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Items:</Typography>
              {/* Robustly render items for both orders and bookings */}
              {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, idx) => (
                  <Typography key={idx}>
                    {item.name || item.menuItem || (typeof item === 'string' ? item : '')}
                    {item.quantity || item.qty ? ` x ${item.quantity || item.qty}` : ''}
                    {item.price || item.total ? ` - ₹${item.price || item.total}` : ''}
                  </Typography>
                ))
              ) : Array.isArray(selectedOrder.menu) && selectedOrder.menu.length > 0 ? (
                selectedOrder.menu.map((item, idx) => (
                  <Typography key={idx}>
                    {item.name || (typeof item === 'string' ? item : '')}
                  </Typography>
                ))
              ) : (
                <Typography color="text.secondary">No items found.</Typography>
              )}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total: ₹{selectedOrder.total}
              </Typography>
              {/* Modern card-style payment receipt after payment */}
              {showReceipt && selectedOrder.status === 'Paid' && (
                <Box sx={{
                  mt: 4,
                  mb: 2,
                  mx: 'auto',
                  maxWidth: 480,
                  bgcolor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 3,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontFamily: 'Inter, Roboto, Arial, sans-serif',
                }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1, letterSpacing: 1, textAlign: 'center' }}>
                    Payment Receipt
                  </Typography>
                  <Divider sx={{ width: '100%', mb: 2 }} />
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontWeight: 500 }}>Order ID: #{selectedOrder._id?.slice(-8).toUpperCase()}</Typography>
                    <Typography>Date: {new Date().toLocaleDateString()}</Typography>
                  </Box>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                    <Typography sx={{ fontWeight: 500, color: 'success.main' }}>Status: ✅ Paid</Typography>
                  </Box>
                  <Divider sx={{ width: '100%', my: 1 }} />
                  <Typography sx={{ width: '100%', fontWeight: 600, mb: 1 }}>Items:</Typography>
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent', fontFamily: 'inherit' }}>
                      <thead>
                        <tr style={{ background: '#f3f4f6' }}>
                          <th style={{ textAlign: 'left', padding: 6, fontWeight: 600, fontSize: 15 }}>Item Name</th>
                          <th style={{ textAlign: 'center', padding: 6, fontWeight: 600, fontSize: 15 }}>Quantity</th>
                          <th style={{ textAlign: 'center', padding: 6, fontWeight: 600, fontSize: 15 }}>Price</th>
                          <th style={{ textAlign: 'center', padding: 6, fontWeight: 600, fontSize: 15 }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: 6 }}>{item.name || item.menuItem}</td>
                            <td style={{ textAlign: 'center', padding: 6 }}>{item.quantity || item.qty}</td>
                            <td style={{ textAlign: 'center', padding: 6 }}>₹{item.price || item.total}</td>
                            <td style={{ textAlign: 'center', padding: 6 }}>₹{(item.price || item.total) * (item.quantity || item.qty)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                  <Divider sx={{ width: '100%', my: 1 }} />
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>Total Amount:</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>₹{selectedOrder.total}</Typography>
                  </Box>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Payment Mode: Online Payment</Typography>
                    <Typography>Transaction ID: TXN{selectedOrder._id?.slice(-8).toUpperCase()}</Typography>
                  </Box>
                  <Divider sx={{ width: '100%', my: 2 }} />
                  <Typography color="success.main" sx={{ fontWeight: 600, fontSize: 16, mb: 1, textAlign: 'center' }}>
                    Payment Successful ✅
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              {/* Only one Pay Now button if pending, only Download Receipt and Close after payment */}
              {selectedOrder.status === 'pending' && !showReceipt && (
                <Button onClick={() => handlePayNow(selectedOrder._id)} color="success" variant="contained">
                  Pay Now
                </Button>
              )}
              {selectedOrder.status === 'Paid' && showReceipt && (
                <Button onClick={() => handleDownloadInvoice(selectedOrder._id)} variant="contained" color="primary">
                  Download Receipt PDF
                </Button>
              )}
              <Button onClick={() => setOrderDialogOpen(false)} color="inherit">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Box>
    </BookingsContext.Provider>
  );
};

// Home Page Component
const HomePage = ({ stats, menu, orders, profile, onNavigate, onAddToCart }) => (
  <Box>
    <Typography variant="h4" fontWeight="bold" sx={{ color: '#1E293B', mb: 4 }}>
      Welcome back, {profile?.name || 'User'} 👋
    </Typography>

    {/* Stats Cards */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2} sx={{ p: 3, bgcolor: '#3B82F6', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold">{stats.totalBookings}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Bookings</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2} sx={{ p: 3, bgcolor: '#10B981', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold">{stats.activeOrders}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Active Orders</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2} sx={{ p: 3, bgcolor: '#F59E0B', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold">₹{stats.totalSpent}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Spent</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2} sx={{ p: 3, bgcolor: '#8B5CF6', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold">{stats.reviewsCount}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Reviews</Typography>
        </Card>
      </Grid>
    </Grid>

    {/* Quick Actions */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ color: '#1E293B', mb: 2 }}>
        Quick Actions
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => onNavigate(1)} startIcon={<MenuIcon />}>
          Browse Menu
        </Button>
        <Button variant="outlined" color="primary" onClick={() => onNavigate(2)} startIcon={<EventIcon />}>
          Book Event
        </Button>
      </Box>
    </Box>

    {/* Popular Items */}
    <Typography variant="h6" fontWeight="bold" sx={{ color: '#1E293B', mb: 2 }}>
      Recommended for You
    </Typography>
    <Grid container spacing={2}>
      {menu.slice(0, 6).map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item._id}>
          <Card elevation={2} sx={{ '&:hover': { transform: 'translateY(-4px)' }, transition: 'all 0.3s' }}>
            <CardMedia component="img" height="140" image={item.image || 'https://via.placeholder.com/300?text=Food'} />
            <CardContent>
              <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">{item.description}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="h6" color="primary">₹{item.price}</Typography>
                <Button size="small" variant="contained" onClick={() => onAddToCart(item)}>
                  Add to Cart
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

// Sample menu data with photos - using lorem picsum which is a reliable image service
const getFoodImage = (id) => `https://picsum.photos/400/300?random=${id}`;

const sampleMenuItems = [
  // Starters
  { id: 1, name: 'Paneer Tikka', description: 'Marinated cottage cheese with spices and herbs', price: 280, category: 'Starters', image: getFoodImage(1) },
  { id: 2, name: 'Spring Rolls', description: 'Crispy veg spring rolls with sweet & sour dip', price: 150, category: 'Starters', image: getFoodImage(2) },
  { id: 3, name: 'Chicken Wings', description: 'Spicy chicken wings with ranch dip', price: 320, category: 'Starters', image: getFoodImage(3) },
  { id: 4, name: 'Caesar Salad', description: 'Fresh romaine with caesar dressing and croutons', price: 180, category: 'Starters', image: getFoodImage(4) },
  { id: 5, name: 'Gobi Manchurian', description: 'Crispy cauliflower in spicy manchurian sauce', price: 200, category: 'Starters', image: getFoodImage(5) },
  { id: 6, name: 'Veg Samosa', description: 'Crispy triangular pastries filled with spiced vegetables', price: 120, category: 'Starters', image: getFoodImage(6) },
  
  // Main Course
  { id: 7, name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken', price: 380, category: 'Main Course', image: getFoodImage(7) },
  { id: 8, name: 'Palak Paneer', description: 'Cottage cheese in creamy spinach curry', price: 280, category: 'Main Course', image: getFoodImage(8) },
  { id: 9, name: 'Biryani', description: 'Fragrant basmati rice with aromatic spices and your choice of protein', price: 320, category: 'Main Course', image: getFoodImage(9) },
  { id: 10, name: 'Grilled Salmon', description: 'Fresh salmon grilled with lemon and herbs', price: 450, category: 'Main Course', image: getFoodImage(10) },
  { id: 11, name: 'Dal Makhani', description: 'Creamy black lentils slow-cooked to perfection', price: 250, category: 'Main Course', image: getFoodImage(11) },
  { id: 12, name: 'Chicken Curry', description: 'Traditional Indian chicken curry with onions and spices', price: 340, category: 'Main Course', image: getFoodImage(12) },
  { id: 13, name: 'Pasta Alfredo', description: 'Creamy white sauce pasta with garlic and herbs', price: 280, category: 'Main Course', image: getFoodImage(13) },
  { id: 14, name: 'Margherita Pizza', description: 'Classic pizza with tomato, mozzarella, and basil', price: 220, category: 'Main Course', image: getFoodImage(14) },
  { id: 15, name: 'Thai Green Curry', description: 'Creamy coconut curry with vegetables and Thai spices', price: 290, category: 'Main Course', image: getFoodImage(15) },
  
  // Desserts
  { id: 16, name: 'Gulab Jamun', description: 'Soft milk dumplings in rose-flavored syrup', price: 150, category: 'Desserts', image: getFoodImage(16) },
  { id: 17, name: 'Chocolate Brownie', description: 'Warm chocolate brownie with vanilla ice cream', price: 180, category: 'Desserts', image: getFoodImage(17) },
  { id: 18, name: 'Ice Cream Sundae', description: 'Rich vanilla ice cream with hot fudge and nuts', price: 160, category: 'Desserts', image: getFoodImage(18) },
  { id: 19, name: 'Tiramisu', description: 'Classic Italian dessert with coffee and mascarpone', price: 220, category: 'Desserts', image: getFoodImage(19) },
  { id: 20, name: 'Cheesecake', description: 'Creamy New York style cheesecake with berries', price: 240, category: 'Desserts', image: getFoodImage(20) },
  
  // Drinks
  { id: 21, name: 'Mango Lassi', description: 'Refreshing mango yogurt drink', price: 120, category: 'Drinks', image: getFoodImage(21) },
  { id: 22, name: 'Fresh Lime Soda', description: 'Sparkling drink with fresh lime and mint', price: 80, category: 'Drinks', image: getFoodImage(22) },
  { id: 23, name: 'Fruit Punch', description: 'Mixed fruit juice with a tropical twist', price: 130, category: 'Drinks', image: getFoodImage(23) },
  { id: 24, name: 'Iced Tea', description: 'Cool and refreshing iced tea with lemon', price: 90, category: 'Drinks', image: getFoodImage(24) },
  { id: 25, name: 'Hot Coffee', description: 'Freshly brewed coffee with cream and sugar', price: 100, category: 'Drinks', image: getFoodImage(25) },
  { id: 26, name: 'Mocktail Mojito', description: 'Virgin mojito with mint and lime', price: 140, category: 'Drinks', image: getFoodImage(26) },
];

// Menu Page Component
const MenuPage = ({ menu, cart, searchQuery, setSearchQuery, onAddToCart, onNavigate }) => {
  const [value, setValue] = useState(0);
  
  // Use sample data if menu from API is empty
  const menuData = menu.length > 0 ? menu : sampleMenuItems;
  
  const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'];

  const filteredMenu = menuData.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = value === 0 || item.category === categories[value];
    return matchesSearch && matchesCategory;
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1E293B' }}>
          Our Menu
        </Typography>
        <Badge badgeContent={cart.reduce((a, c) => a + c.qty, 0)} color="error">
          <Button variant="contained" startIcon={<ShoppingCartIcon />} onClick={() => onNavigate(3)}>
            View Cart ({cart.reduce((a, c) => a + c.qty, 0)})
          </Button>
        </Badge>
      </Box>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={value} 
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              minHeight: 48,
            }
          }}
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search dishes by name or description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />

      {/* Menu Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
        {filteredMenu.map((item) => (
          <Card 
            key={item.id || item._id}
            elevation={3} 
            sx={{ 
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: 6,
                '& .description-overlay': {
                  opacity: 1,
                  height: 'auto',
                }
              }
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia 
                component="img" 
                height="200" 
                image={item.image || 'https://via.placeholder.com/400x300/EAEAEA/999999?text=No+Image'} 
                alt={item.name}
                sx={{ objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300/EAEAEA/999999?text=No+Image';
                }}
              />
              {/* Description Overlay on Hover */}
              <Box
                className="description-overlay"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                  color: 'white',
                  p: 2,
                  opacity: 0,
                  height: 0,
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                  {item.description}
                </Typography>
              </Box>
            </Box>
            
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#1E293B', flex: 1 }}>
                  {item.name}
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#3B82F6', ml: 2 }}>
                  ₹{item.price}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip 
                  label={item.category} 
                  size="small" 
                  sx={{ 
                    bgcolor: '#E0E7FF',
                    color: '#3730A3',
                    fontWeight: 600,
                    height: 24
                  }} 
                />
              </Box>
              
              <Button 
                fullWidth 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => onAddToCart(item)}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: '#3B82F6',
                  '&:hover': { bgcolor: '#2563EB' }
                }}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {filteredMenu.length === 0 && (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No items found. Try adjusting your search or category filter.
          </Typography>
        </Card>
      )}
    </Box>
  );
};

const BookingPage = ({ onBookingSubmit }) => {

  const [formData, setFormData] = useState({
    eventType: '',
    date: '',
    time: '',
    location: '',
    guests: '',
    specialRequests: ''
  });
  const [menuOptions, setMenuOptions] = useState({ veg: [], nonVeg: [] });
  const [menuLoading, setMenuLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState([]); // store selected menu IDs
  const [activeStep, setActiveStep] = useState(0);
  const bookings = React.useContext(BookingsContext);
  const steps = ['Event Details', 'Confirmation'];

  // Fetch menu options for selected event type when step 1 is completed
  // No menu selection step, so no menu fetch needed

  const handleSubmit = () => {
    // Compose booking data as per backend schema
    const bookingData = {
      eventType: formData.eventType,
      eventDate: formData.date, // backend expects eventDate
      time: formData.time,
      location: formData.location,
      guests: Number(formData.guests),
      menu: selectedMenu, // backend schema uses `menu` field (array of MenuItem ids)
      // omit status so backend default 'pending' applies, or set lowercase
      status: 'pending',
      specialRequests: formData.specialRequests
    };
    onBookingSubmit(bookingData);
    setFormData({ eventType: '', date: '', time: '', location: '', guests: '', specialRequests: '' });
    setSelectedMenu([]);
    setActiveStep(0);
  };


  return (
    <Box>
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#1E293B' }}>
          Book a Catering Event
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Event Details */}
        {activeStep === 0 && (
          <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              >
                <MenuItem value="Wedding">Wedding</MenuItem>
                <MenuItem value="Birthday">Birthday</MenuItem>
                <MenuItem value="Corporate Event">Corporate Event</MenuItem>
                <MenuItem value="Anniversary">Anniversary</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Date" type="date" sx={{ mb: 3 }} InputLabelProps={{ shrink: true }} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <TextField fullWidth label="Time" type="time" sx={{ mb: 3 }} InputLabelProps={{ shrink: true }} value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
            <TextField fullWidth label="Location" sx={{ mb: 3 }} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            <TextField fullWidth label="Number of Guests" type="number" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" onClick={() => setActiveStep(1)} disabled={!(formData.eventType && formData.date && formData.time && formData.location && formData.guests)}>
                Next
              </Button>
            </Box>
          </Box>
        )}



        {/* Step 2: Confirmation (now step 2) */}
        {activeStep === 1 && (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Please review your booking details and submit.
            </Alert>
            <Box sx={{ mb: 2 }}>
              <Typography><b>Event Type:</b> {formData.eventType}</Typography>
              <Typography><b>Date:</b> {formData.date}</Typography>
              <Typography><b>Time:</b> {formData.time}</Typography>
              <Typography><b>Location:</b> {formData.location}</Typography>
              <Typography><b>Guests:</b> {formData.guests}</Typography>
              {formData.specialRequests && <Typography><b>Special Requests:</b> {formData.specialRequests}</Typography>}
            </Box>
            <TextField fullWidth multiline rows={3} label="Special Requests" sx={{ mb: 3 }} value={formData.specialRequests} onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(0)}>Back</Button>
              <Button variant="contained" onClick={handleSubmit}>
                Submit Booking
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* User's Bookings Table */}
      <Paper sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#1E293B' }}>
          My Event Bookings
        </Typography>
        {bookings && bookings.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Guests</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>{b.eventType}</TableCell>
                    <TableCell>{b.date ? new Date(b.date).toLocaleDateString() : ''}</TableCell>
                    <TableCell>{b.time}</TableCell>
                    <TableCell>{b.location}</TableCell>
                    <TableCell>{b.guests || b.numGuests}</TableCell>
                    <TableCell>
                      <Chip
                        label={b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Pending'}
                        size="small"
                        sx={{
                          bgcolor:
                            b.status === 'Approved' || b.status === 'approved' ? '#22c55e' :
                            b.status === 'Rejected' || b.status === 'rejected' ? '#ef4444' :
                            '#facc15',
                          color: b.status === 'Approved' || b.status === 'approved' ? 'white' : '#1e293b',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary">No bookings yet.</Typography>
        )}
      </Paper>
    </Box>
  );
};

// Cart Page Component
const CartPage = ({ cart, onUpdateQuantity, onRemove, totalAmount, onCheckout, onNavigate }) => (
  <Box>
    <Typography variant="h4" fontWeight="bold" sx={{ color: '#1E293B', mb: 4 }}>
      Your Cart
    </Typography>

    {cart.length === 0 ? (
      <Card sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Your cart is empty. Add items from the menu!
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => onNavigate(1)}>
          Browse Menu
        </Button>
      </Card>
    ) : (
      <>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CardMedia component="img" sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }} image={item.image} />
                      <Box>
                        <Typography fontWeight="bold">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton size="small" onClick={() => onUpdateQuantity(item._id, -1)}>
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{item.qty}</Typography>
                      <IconButton size="small" onClick={() => onUpdateQuantity(item._id, 1)}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>₹{item.price * item.qty}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onRemove(item._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Card sx={{ p: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              Total: ₹{totalAmount}
            </Typography>
            <Button variant="contained" size="large" onClick={onCheckout}>
              Proceed to Checkout
            </Button>
          </Box>
        </Card>
      </>
    )}
  </Box>
);

// Orders Page Component
const OrdersPage = ({ orders, onViewDetails, onDownloadInvoice }) => (
  <Box>
    <Typography variant="h4" fontWeight="bold" sx={{ color: '#1E293B', mb: 4 }}>
      My Orders
    </Typography>

    {orders.length === 0 ? (
      <Card sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No orders yet.
        </Typography>
      </Card>
    ) : (
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Order #{order._id?.slice(-8).toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ₹{order.total}
                    </Typography>
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{
                        bgcolor:
                          order.status === 'completed' ? '#10B981' :
                          order.status === 'pending' ? '#F59E0B' :
                          order.status === 'confirmed' ? '#3B82F6' : '#EF4444',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button variant="outlined" size="small" onClick={() => onViewDetails(order)}>
                    View Details
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => onDownloadInvoice(order._id)}>
                    Download Invoice
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
);

// Profile Page Component
const ProfilePage = ({ profile, uploading, setUploading }) => {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    contact: profile.contact || '',
  });

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#1E293B', mb: 4 }}>
        My Profile
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: '#3B82F6' }}>
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Button variant="outlined" startIcon={<CloudUploadIcon />} disabled={uploading}>
              Upload Photo
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Personal Information
            </Typography>
            <TextField fullWidth label="Name" sx={{ mb: 2 }} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField fullWidth label="Email" sx={{ mb: 2 }} value={formData.email} />
            <TextField fullWidth label="Contact" sx={{ mb: 2 }} value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
            <Button variant="contained">Update Profile</Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Reviews Page Component
const ReviewsPage = ({ reviews, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onReviewSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#1E293B', mb: 4 }}>
        Reviews & Testimonials
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Write a Review
        </Typography>
        <Typography component="legend">Rating</Typography>
        <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
        <TextField fullWidth multiline rows={4} label="Your Review" sx={{ mt: 2, mb: 2 }} value={comment} onChange={(e) => setComment(e.target.value)} />
        <Button variant="contained" onClick={handleSubmit}>
          Submit Review
        </Button>
      </Paper>

      <Typography variant="h6" fontWeight="bold" sx={{ color: '#1E293B', mb: 2 }}>
        Your Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No reviews yet.</Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {reviews.map((review) => (
            <Grid item xs={12} key={review._id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Rating value={review.rating} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography>{review.comment || review.text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UserDashboard;

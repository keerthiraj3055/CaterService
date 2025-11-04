import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, total } = useContext(CartContext);
  const [placing, setPlacing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const placeOrder = async () => {
    if (cart.length === 0) return;
    try {
      setPlacing(true);
      // Simulate payment delay
      await new Promise((r) => setTimeout(r, 2000));

      const payload = {
        items: cart.map(i => ({ id: i._id || i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'Auto (Simulated)',
        // Compatibility fields if backend expects these
        userId: undefined,
        cartItems: cart.map(i => ({ id: i._id || i.id, name: i.name, price: i.price, quantity: i.quantity })),
        totalAmount: total,
      };
      try {
        const res = await axiosInstance.post('/orders', payload);
        localStorage.setItem('lastOrderId', res.data?._id || res.data?.id || 'local');
        // Try to trigger invoice generation on backend if supported (optional)
        try { await axiosInstance.post(`/orders/${res.data?._id || res.data?.id}/invoice`); } catch (e) {}
      } catch (e) {
        const existing = JSON.parse(localStorage.getItem('orders') || '[]');
        const localOrder = { id: `local-${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
        localStorage.setItem('orders', JSON.stringify([localOrder, ...existing]));
      }
      clearCart();
      setToast({ message: 'Payment successful! Order placed automatically.', type: 'success' });
      navigate('/orders');
    } finally {
      setPlacing(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <h2 className="text-3xl font-bold text-[#1E293B] mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div key={item._id || item.id} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                <img src={item.image || ''} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                <div className="flex-1">
                  <p className="font-semibold text-[#1E293B]">{item.name}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) - 1)} className="px-2 py-1 border rounded">-</button>
                  <input value={item.quantity || 1} onChange={(e)=>updateQuantity(item._id || item.id, parseInt(e.target.value || '1', 10))} className="w-12 text-center border rounded" />
                  <button onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) + 1)} className="px-2 py-1 border rounded">+</button>
                </div>
                <button onClick={() => removeFromCart(item._id || item.id)} className="text-red-600 hover:underline">Remove</button>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 h-fit">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">{formatCurrency(total)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Delivery</span>
              <span className="font-semibold">{formatCurrency(0)}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold text-[#1E293B] mb-4">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setConfirmOpen(true)} 
              className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2"
              disabled={placing}
            >
              Place Order
            </Button>
          </div>
        </div>
      )}
      <Dialog open={confirmOpen} onClose={() => !placing && setConfirmOpen(false)}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <p>Click below to simulate payment and place your order.</p>
          <p className="mt-2 font-semibold">Total: {formatCurrency(total)}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={placing}>Cancel</Button>
          <Button onClick={placeOrder} variant="contained" color="success" disabled={placing} startIcon={placing ? <CircularProgress size={18} color="inherit" /> : null}>
            {placing ? 'Processing…' : 'Pay Now 💳'}
          </Button>
        </DialogActions>
      </Dialog>
  </div>
);
};

export default Cart;

import React, { createContext, useMemo, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => (i._id || i.id) === (item._id || item.id));
      if (existing) {
        return prev.map((i) => ((i._id || i.id) === (item._id || item.id) ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== id));
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) => prev.map((item) => ( (item._id || item.id) === id ? { ...item, quantity: Math.max(1, qty) } : item)));
  };

  const clearCart = () => setCart([]);

  const total = useMemo(() => cart.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0), [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

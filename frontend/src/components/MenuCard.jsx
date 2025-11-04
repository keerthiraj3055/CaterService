import React, { useContext } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { CartContext } from '../context/CartContext';


const MenuCard = ({ item }) => {
  const { addToCart } = useContext(CartContext);
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: '1rem', margin: '1rem', width: 220 }}>
      <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: 8 }} />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p>{formatCurrency(item.price)}</p>
      <button onClick={() => addToCart(item)}>Add to Cart</button>
    </div>
  );
};

export default MenuCard;

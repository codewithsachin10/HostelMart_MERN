// client/src/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- 👇 MODIFIED: Stock Check Added ---
  const addToCart = (product) => {
    if (product.countInStock === 0) {
      alert('Sorry, this item is out of stock.');
      return;
    }
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      
      if (existingItem) {
        // Check stock limit
        if (existingItem.quantity + 1 > product.countInStock) {
          alert('Stock limit reached! You cannot add more of this item.');
          return prevItems; // Return state unchanged
        }
        // If ok, increase quantity
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // --- 👇 MODIFIED: Stock Check Added ---
  const updateQuantity = (productId, change) => {
    setCartItems((prevItems) => {
      const itemToUpdate = prevItems.find((item) => item._id === productId);
      if (!itemToUpdate) return prevItems; // Item not found

      // Check stock only when *increasing* quantity
      if (change === 1) {
        if (itemToUpdate.quantity + 1 > itemToUpdate.countInStock) {
          alert('Stock limit reached!');
          return prevItems; // Return state unchanged
        }
      }

      // Apply the change
      return prevItems
        .map((item) => {
          if (item._id === productId) {
            return { ...item, quantity: item.quantity + change };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Remove item if quantity drops to 0
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
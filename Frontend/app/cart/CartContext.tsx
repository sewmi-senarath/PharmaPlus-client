import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartState } from "./types";
import { CartStorage } from "./CartStorage";

interface CartContextType {
  cart: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>({ items: [] });

  // Load cart from storage on mount
  useEffect(() => {
    async function loadCart() {
      const savedCart = await CartStorage.load();
      if (savedCart) {
        setCart(savedCart);
      }
    }
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    CartStorage.save(cart);
  }, [cart]);

  // Add or update item in cart
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exists = prev.items.find(i => i.id === item.id);
      if (exists) {
        return {
          items: prev.items.map(i =>
            i.id === item.id 
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...prev.items, item] };
    });
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(prev => ({
      items: prev.items.filter(i => i.id !== id),
    }));
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    setCart(prev => ({
      items: prev.items.map(i =>
        i.id === id
          ? { ...i, quantity: Math.max(0, quantity) }
          : i
      ),
    }));
  };

  // Clear cart
  const clearCart = () => {
    setCart({ items: [] });
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return ctx;
}
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "alhan_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((bookId, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.bookId === bookId);
      if (existing) {
        return prev.map((i) =>
          i.bookId === bookId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { bookId, quantity }];
    });
  }, []);

  const removeItem = useCallback((bookId) => {
    setItems((prev) => prev.filter((i) => i.bookId !== bookId));
  }, []);

  const updateQuantity = useCallback((bookId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.bookId === bookId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart باید داخل CartProvider استفاده شود");
  return ctx;
}
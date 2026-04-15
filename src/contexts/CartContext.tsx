import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type RentalPeriod = "day" | "week" | "month";

export interface CartItem {
  id: string;
  name: string;
  prices: { day: number; week: number; month: number };
  quantity: number;
  period: RentalPeriod;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "period">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updatePeriod: (id: string, period: RentalPeriod) => void;
  totalItems: number;
  totalPrice: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

const getItemPrice = (item: CartItem) => item.prices[item.period] * item.quantity;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: Omit<CartItem, "quantity" | "period">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1, period: "day" as RentalPeriod }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);

  const updatePeriod = useCallback((id: string, period: RentalPeriod) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, period } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + getItemPrice(i), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, updatePeriod, totalItems, totalPrice, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

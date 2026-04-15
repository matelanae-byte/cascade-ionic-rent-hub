import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { RentalPeriod } from "./CartContext";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  period: RentalPeriod;
  price: number;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  city: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  processed: boolean;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "processed">) => void;
  toggleProcessed: (id: string) => void;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
};

const STORAGE_KEY = "cascade_orders";

const loadOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = useCallback((order: Omit<Order, "id" | "createdAt" | "processed">) => {
    setOrders((prev) => [
      { ...order, id: `order-${Date.now()}`, createdAt: new Date().toISOString(), processed: false },
      ...prev,
    ]);
  }, []);

  const toggleProcessed = useCallback((id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, processed: !o.processed } : o)));
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, toggleProcessed }}>
      {children}
    </OrdersContext.Provider>
  );
};

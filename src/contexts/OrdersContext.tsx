import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  addOrder: (order: Omit<Order, "id" | "createdAt" | "processed">) => Promise<void>;
  toggleProcessed: (id: string) => void;
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
};

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setOrders(
        data.map((r: any) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          city: r.city,
          items: (r.items ?? []) as OrderItem[],
          total: Number(r.total),
          createdAt: r.created_at,
          processed: r.processed,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = useCallback(async (order: Omit<Order, "id" | "createdAt" | "processed">) => {
    await supabase.from("orders").insert({
      name: order.name,
      phone: order.phone,
      city: order.city,
      items: order.items as any,
      total: order.total,
    });
    // Re-fetch only if admin is viewing (select will return empty for anon due to RLS)
    fetchOrders();
  }, [fetchOrders]);

  const toggleProcessed = useCallback(async (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    await supabase
      .from("orders")
      .update({ processed: !order.processed })
      .eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, processed: !o.processed } : o)));
  }, [orders]);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, toggleProcessed, loading }}>
      {children}
    </OrdersContext.Provider>
  );
};

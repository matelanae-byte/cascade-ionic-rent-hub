import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RentalPeriod } from "./CartContext";

export type OrderStatus = "new" | "in_progress" | "delivered" | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  delivered: "Доставлена",
  cancelled: "Отменена",
};

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
  status: OrderStatus;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "processed" | "status">) => Promise<void>;
  toggleProcessed: (id: string) => void;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
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
          status: (r.status ?? "new") as OrderStatus,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = useCallback(async (order: Omit<Order, "id" | "createdAt" | "processed" | "status">) => {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        name: order.name,
        phone: order.phone,
        city: order.city,
        items: order.items as any,
        total: order.total,
      })
      .select()
      .single();
    if (error) {
      console.error("Failed to insert order:", error);
    } else if (data) {
      supabase.functions
        .invoke("notify-telegram", {
          body: {
            type: "order",
            name: order.name,
            phone: order.phone,
            city: order.city,
            items: order.items,
            total: order.total,
            orderId: data.id,
          },
        })
        .catch((e) => console.error("notify-telegram failed", e));
    }
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

  const updateStatus = useCallback(async (id: string, status: OrderStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) {
      console.error("Failed to update status:", error);
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, toggleProcessed, updateStatus, loading }}>
      {children}
    </OrdersContext.Provider>
  );
};

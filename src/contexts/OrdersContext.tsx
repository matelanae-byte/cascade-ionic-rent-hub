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
  // Параметры подбора (необязательные)
  taskType?: string;
  area?: string;
  people?: string;
  height?: string;
  rentalTerm?: string;
  comment?: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "processed" | "status">) => Promise<void>;
  toggleProcessed: (id: string) => void;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
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
          taskType: r.task_type ?? undefined,
          area: r.area ?? undefined,
          people: r.people ?? undefined,
          height: r.height ?? undefined,
          rentalTerm: r.rental_term ?? undefined,
          comment: r.comment ?? undefined,
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
        task_type: order.taskType ?? null,
        area: order.area ?? null,
        people: order.people ?? null,
        height: order.height ?? null,
        rental_term: order.rentalTerm ?? null,
        comment: order.comment ?? null,
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
            taskType: order.taskType,
            area: order.area,
            people: order.people,
            height: order.height,
            rentalTerm: order.rentalTerm,
            comment: order.comment,
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

  const deleteOrder = useCallback(async (id: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete order:", error);
      return;
    }
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, toggleProcessed, updateStatus, deleteOrder, loading }}>
      {children}
    </OrdersContext.Provider>
  );
};

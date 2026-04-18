import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { Package, Grip, Droplets, Wrench, Brush } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  category: string;
  iconName: string;
  name: string;
  desc: string;
  prices: { day: number; week: number; month: number };
  hidden: boolean;
  order: number;
  image?: string;
}

export const iconMap: Record<string, React.ElementType> = {
  Package,
  Grip,
  Droplets,
  Wrench,
  Brush,
};

interface ProductsContextType {
  products: Product[];
  visibleProducts: Product[];
  loading: boolean;
  addProduct: (p: Omit<Product, "id" | "order">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Omit<Product, "id">>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  reorderProducts: (fromIndex: number, toIndex: number) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rowToProduct = (r: any): Product => ({
  id: r.id,
  category: r.category,
  iconName: r.icon_name,
  name: r.name,
  desc: r.description ?? "",
  prices: { day: Number(r.price_day), week: Number(r.price_week), month: Number(r.price_month) },
  hidden: !!r.hidden,
  order: r.sort_order ?? 0,
  image: r.image ?? undefined,
});

type ProductRow = {
  category?: string;
  icon_name?: string;
  name?: string;
  description?: string;
  price_day?: number;
  price_week?: number;
  price_month?: number;
  hidden?: boolean;
  sort_order?: number;
  image?: string | null;
};

const productToRow = (p: Partial<Product>): ProductRow => {
  const row: ProductRow = {};
  if (p.category !== undefined) row.category = p.category;
  if (p.iconName !== undefined) row.icon_name = p.iconName;
  if (p.name !== undefined) row.name = p.name;
  if (p.desc !== undefined) row.description = p.desc;
  if (p.prices !== undefined) {
    row.price_day = p.prices.day;
    row.price_week = p.prices.week;
    row.price_month = p.prices.month;
  }
  if (p.hidden !== undefined) row.hidden = p.hidden;
  if (p.order !== undefined) row.sort_order = p.order;
  if (p.image !== undefined) row.image = p.image ?? null;
  return row;
};

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("Failed to fetch products:", error);
      return;
    }
    setProducts((data ?? []).map(rowToProduct));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
    const channel = supabase
      .channel("products-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        fetchProducts();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  const addProduct = useCallback(async (p: Omit<Product, "id" | "order">) => {
    const nextOrder = products.length;
    const { error } = await supabase.from("products").insert({
      ...productToRow(p),
      sort_order: nextOrder,
      category: p.category,
      icon_name: p.iconName,
      name: p.name,
    });
    if (error) {
      console.error("Failed to add product:", error);
      throw error;
    }
    await fetchProducts();
  }, [products.length, fetchProducts]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Omit<Product, "id">>) => {
    const { error } = await supabase.from("products").update(productToRow(updates)).eq("id", id);
    if (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
    await fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
    await fetchProducts();
  }, [fetchProducts]);

  const reorderProducts = useCallback(async (fromIndex: number, toIndex: number) => {
    const sorted = [...products].sort((a, b) => a.order - b.order);
    const [moved] = sorted.splice(fromIndex, 1);
    sorted.splice(toIndex, 0, moved);
    const updates = sorted.map((p, i) => ({ id: p.id, sort_order: i }));
    // Optimistic local update
    setProducts(sorted.map((p, i) => ({ ...p, order: i })));
    await Promise.all(
      updates.map((u) => supabase.from("products").update({ sort_order: u.sort_order }).eq("id", u.id))
    );
  }, [products]);

  const visibleProducts = [...products].filter((p) => !p.hidden).sort((a, b) => a.order - b.order);

  return (
    <ProductsContext.Provider value={{ products, visibleProducts, loading, addProduct, updateProduct, deleteProduct, reorderProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

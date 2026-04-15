import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { Package, Grip, Droplets, Wrench } from "lucide-react";

export interface Product {
  id: string;
  category: string;
  iconName: string;
  name: string;
  desc: string;
  prices: { day: number; week: number; month: number };
  hidden: boolean;
  order: number;
  image?: string; // base64 or URL
}

const defaultProducts: Product[] = [
  {
    id: "wfp-kit-15",
    category: "Комплекты",
    iconName: "Package",
    name: "Комплект WFP для мойки фасадов до 15 м",
    desc: "Мобильный комплект для мойки фасадов и окон с земли до 15 метров: станция, штанга, щетка, шланг.",
    prices: { day: 7000, week: 35000, month: 90000 },
    hidden: false,
    order: 0,
  },
  {
    id: "pole-12",
    category: "Штанги",
    iconName: "Grip",
    name: "WFP-штанга 12 м (карбон)",
    desc: "Легкая карбоновая телескопическая штанга для мойки окон и фасадов до 12 м.",
    prices: { day: 3000, week: 12000, month: 30000 },
    hidden: false,
    order: 1,
  },
  {
    id: "pole-15",
    category: "Штанги",
    iconName: "Grip",
    name: "WFP-штанга 15 м (карбон)",
    desc: "Усиленная карбоновая штанга для работы до 15 м с земли.",
    prices: { day: 4000, week: 16000, month: 40000 },
    hidden: false,
    order: 2,
  },
  {
    id: "water-station",
    category: "Системы подачи воды",
    iconName: "Droplets",
    name: "Станция подготовки воды для WFP",
    desc: "Система очищенной воды для мойки фасадов и окон без разводов.",
    prices: { day: 5000, week: 20000, month: 55000 },
    hidden: false,
    order: 3,
  },
  {
    id: "chem-pump",
    category: "Доп. оборудование",
    iconName: "Wrench",
    name: "Насос-дозатор химии",
    desc: "Подача химии для сложных загрязнений и мойки витрин.",
    prices: { day: 2000, week: 8000, month: 20000 },
    hidden: false,
    order: 4,
  },
  {
    id: "hose-reel",
    category: "Доп. оборудование",
    iconName: "Wrench",
    name: "Шланг высокого давления с катушкой",
    desc: "Шланг с катушкой для удобной работы на объекте, подключение к станции.",
    prices: { day: 1500, week: 6000, month: 15000 },
    hidden: false,
    order: 5,
  },
];

export const iconMap: Record<string, React.ElementType> = {
  Package,
  Grip,
  Droplets,
  Wrench,
};

interface ProductsContextType {
  products: Product[];
  visibleProducts: Product[];
  addProduct: (p: Omit<Product, "id" | "order">) => void;
  updateProduct: (id: string, updates: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (fromIndex: number, toIndex: number) => void;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
};

const STORAGE_KEY = "cascade_products";

const loadProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultProducts;
};

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((p: Omit<Product, "id" | "order">) => {
    setProducts((prev) => [
      ...prev,
      { ...p, id: `product-${Date.now()}`, order: prev.length },
    ]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Omit<Product, "id">>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i })));
  }, []);

  const reorderProducts = useCallback((fromIndex: number, toIndex: number) => {
    setProducts((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const [moved] = sorted.splice(fromIndex, 1);
      sorted.splice(toIndex, 0, moved);
      return sorted.map((p, i) => ({ ...p, order: i }));
    });
  }, []);

  const visibleProducts = [...products].filter((p) => !p.hidden).sort((a, b) => a.order - b.order);

  return (
    <ProductsContext.Provider value={{ products, visibleProducts, addProduct, updateProduct, deleteProduct, reorderProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

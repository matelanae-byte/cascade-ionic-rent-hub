import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { Package, Grip, Droplets, Wrench, Brush } from "lucide-react";

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

const STORAGE_BASE = "https://lcvgkrznmupwfuejvhfj.supabase.co/storage/v1/object/public/product-images";

const defaultProducts: Product[] = [
  // === Комплекты ===
  {
    id: "wfp-kit-10",
    category: "Комплекты",
    iconName: "Package",
    name: "Стартовый WFP-комплект до 10 м",
    desc: "Базовый комплект для начинающих: штанга 10 м, портативный фильтр, щётка и шланг.",
    prices: { day: 5000, week: 25000, month: 65000 },
    hidden: false,
    order: 0,
    image: `${STORAGE_BASE}/wfp-kit-10.png`,
  },
  {
    id: "wfp-kit-15",
    category: "Комплекты",
    iconName: "Package",
    name: "Комплект WFP для мойки фасадов до 15 м",
    desc: "Мобильный комплект для мойки фасадов и окон с земли до 15 метров: станция, штанга, щётка, шланг.",
    prices: { day: 7000, week: 35000, month: 90000 },
    hidden: false,
    order: 1,
    image: `${STORAGE_BASE}/wfp-kit-15.png`,
  },
  {
    id: "wfp-kit-20",
    category: "Комплекты",
    iconName: "Package",
    name: "Профессиональный WFP-комплект до 20 м",
    desc: "Полный комплект для работы на высоте до 20 м: усиленная штанга, промышленная станция, несколько щёток.",
    prices: { day: 10000, week: 50000, month: 130000 },
    hidden: false,
    order: 2,
    image: `${STORAGE_BASE}/wfp-kit-20.png`,
  },
  // === Штанги ===
  {
    id: "pole-8-fiber",
    category: "Штанги",
    iconName: "Grip",
    name: "WFP-штанга 8 м (стеклопластик)",
    desc: "Бюджетная стеклопластиковая штанга для работы до 8 м. Прочная, подходит для новичков.",
    prices: { day: 2000, week: 8000, month: 20000 },
    hidden: false,
    order: 3,
    image: `${STORAGE_BASE}/pole-8-fiber.png`,
  },
  {
    id: "pole-12",
    category: "Штанги",
    iconName: "Grip",
    name: "WFP-штанга 12 м (карбон)",
    desc: "Лёгкая карбоновая телескопическая штанга для мойки окон и фасадов до 12 м.",
    prices: { day: 3000, week: 12000, month: 30000 },
    hidden: false,
    order: 4,
    image: `${STORAGE_BASE}/pole-12.png`,
  },
  {
    id: "pole-15",
    category: "Штанги",
    iconName: "Grip",
    name: "WFP-штанга 15 м (карбон)",
    desc: "Усиленная карбоновая штанга для работы до 15 м с земли.",
    prices: { day: 4000, week: 16000, month: 40000 },
    hidden: false,
    order: 5,
    image: `${STORAGE_BASE}/pole-15.png`,
  },
  {
    id: "pole-18",
    category: "Штанги",
    iconName: "Grip",
    name: "WFP-штанга 18 м (карбон)",
    desc: "Профессиональная карбоновая штанга для мойки фасадов на высоте до 18 м.",
    prices: { day: 5500, week: 22000, month: 55000 },
    hidden: false,
    order: 6,
    image: `${STORAGE_BASE}/pole-18.png`,
  },
  // === Системы подачи воды ===
  {
    id: "water-station",
    category: "Системы подачи воды",
    iconName: "Droplets",
    name: "Станция подготовки воды для WFP",
    desc: "Система очищенной воды для мойки фасадов и окон без разводов.",
    prices: { day: 5000, week: 20000, month: 55000 },
    hidden: false,
    order: 7,
    image: `${STORAGE_BASE}/water-station.png`,
  },
  {
    id: "water-station-compact",
    category: "Системы подачи воды",
    iconName: "Droplets",
    name: "Компактная станция подготовки воды",
    desc: "Портативная система фильтрации для небольших объектов. Лёгкая, один картридж.",
    prices: { day: 3000, week: 12000, month: 32000 },
    hidden: false,
    order: 8,
    image: `${STORAGE_BASE}/water-station-compact.png`,
  },
  {
    id: "mobile-filtration",
    category: "Системы подачи воды",
    iconName: "Droplets",
    name: "Мобильная система фильтрации на тележке",
    desc: "Передвижная многоступенчатая система фильтрации воды на колёсах для крупных объектов.",
    prices: { day: 6000, week: 25000, month: 65000 },
    hidden: false,
    order: 9,
    image: `${STORAGE_BASE}/mobile-filtration.png`,
  },
  // === Доп. оборудование ===
  {
    id: "chem-pump",
    category: "Доп. оборудование",
    iconName: "Wrench",
    name: "Насос-дозатор химии",
    desc: "Подача химии для сложных загрязнений и мойки витрин.",
    prices: { day: 2000, week: 8000, month: 20000 },
    hidden: false,
    order: 10,
    image: `${STORAGE_BASE}/chem-pump.png`,
  },
  {
    id: "hose-reel",
    category: "Доп. оборудование",
    iconName: "Wrench",
    name: "Шланг высокого давления с катушкой",
    desc: "Шланг с катушкой для удобной работы на объекте, подключение к станции.",
    prices: { day: 1500, week: 6000, month: 15000 },
    hidden: false,
    order: 11,
    image: `${STORAGE_BASE}/hose-reel.png`,
  },
  {
    id: "brush-set",
    category: "Доп. оборудование",
    iconName: "Brush",
    name: "Набор щёток для WFP-штанг",
    desc: "Комплект щёток разных размеров и жёсткости для различных типов поверхностей.",
    prices: { day: 1000, week: 4000, month: 10000 },
    hidden: false,
    order: 12,
    image: `${STORAGE_BASE}/brush-set.png`,
  },
  {
    id: "trolley-cart",
    category: "Доп. оборудование",
    iconName: "Wrench",
    name: "Тележка для оборудования",
    desc: "Профессиональная тележка на колёсах с отсеками для штанг и аксессуаров.",
    prices: { day: 1500, week: 6000, month: 15000 },
    hidden: false,
    order: 13,
    image: `${STORAGE_BASE}/trolley-cart.png`,
  },
];

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

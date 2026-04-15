import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Check, X, Package, LogOut, Upload, ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts, iconMap, type Product } from "@/contexts/ProductsContext";
import { useOrders, type Order } from "@/contexts/OrdersContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const periodLabels: Record<string, string> = { day: "День", week: "Неделя", month: "Месяц" };

const formatPrice = (n: number) => n.toLocaleString("ru-RU") + " ₽";

/* ─── Product Form ─── */
interface ProductFormProps {
  initial?: Product;
  onSave: (data: Omit<Product, "id" | "order">) => void;
  onCancel: () => void;
}

const iconOptions = Object.keys(iconMap);

const ProductForm = ({ initial, onSave, onCancel }: ProductFormProps) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [iconName, setIconName] = useState(initial?.iconName ?? "Package");
  const [dayPrice, setDayPrice] = useState(String(initial?.prices.day ?? ""));
  const [weekPrice, setWeekPrice] = useState(String(initial?.prices.week ?? ""));
  const [monthPrice, setMonthPrice] = useState(String(initial?.prices.month ?? ""));
  const [hidden, setHidden] = useState(initial?.hidden ?? false);
  const [image, setImage] = useState(initial?.image ?? "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      desc,
      category,
      iconName,
      prices: { day: Number(dayPrice) || 0, week: Number(weekPrice) || 0, month: Number(monthPrice) || 0 },
      hidden,
      image: image || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Название</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Категория</label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Описание</label>
        <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Фото товара</label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {image && <img src={image} alt="preview" className="mt-2 h-24 w-auto rounded-md border object-cover" />}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Цена / день (₽)</label>
          <Input type="number" value={dayPrice} onChange={(e) => setDayPrice(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Цена / неделя (₽)</label>
          <Input type="number" value={weekPrice} onChange={(e) => setWeekPrice(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Цена / месяц (₽)</label>
          <Input type="number" value={monthPrice} onChange={(e) => setMonthPrice(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-foreground">Иконка</label>
        <select value={iconName} onChange={(e) => setIconName(e.target.value)} className="rounded-md border border-input bg-background px-3 py-1.5 text-sm">
          {iconOptions.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} id="hidden-cb" className="accent-primary" />
        <label htmlFor="hidden-cb" className="text-sm text-muted-foreground">Скрыть товар из каталога</label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="gap-1.5"><Check size={16} /> Сохранить</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="gap-1.5"><X size={16} /> Отмена</Button>
      </div>
    </form>
  );
};

/* ─── Products Tab ─── */
const ProductsTab = () => {
  const { products, addProduct, updateProduct, deleteProduct, reorderProducts } = useProducts();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const sorted = [...products].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {adding ? (
        <div className="rounded-lg border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Новый товар</h3>
          <ProductForm
            onSave={(data) => { addProduct(data); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        </div>
      ) : (
        <Button onClick={() => setAdding(true)} className="gap-1.5"><Plus size={16} /> Добавить товар</Button>
      )}

      <div className="space-y-3">
        {sorted.map((p, idx) => (
          <div key={p.id} className={`rounded-lg border bg-card p-4 ${p.hidden ? "opacity-60" : ""}`}>
            {editing === p.id ? (
              <ProductForm
                initial={p}
                onSave={(data) => { updateProduct(p.id, data); setEditing(null); }}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => idx > 0 && reorderProducts(idx, idx - 1)} disabled={idx === 0} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronUp size={16} /></button>
                  <button onClick={() => idx < sorted.length - 1 && reorderProducts(idx, idx + 1)} disabled={idx === sorted.length - 1} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronDown size={16} /></button>
                </div>

                {p.image ? (
                  <img src={p.image} alt={p.name} className="h-14 w-14 rounded-md object-cover border flex-shrink-0" />
                ) : (
                  <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    {(() => { const Icon = iconMap[p.iconName] || Package; return <Icon size={20} className="text-muted-foreground" />; })()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-sm">{p.name}</span>
                    {p.hidden && <Badge variant="secondary" className="text-xs">Скрыт</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.category}</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>День: {formatPrice(p.prices.day)}</span>
                    <span>Неделя: {formatPrice(p.prices.week)}</span>
                    <span>Месяц: {formatPrice(p.prices.month)}</span>
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => updateProduct(p.id, { hidden: !p.hidden })} title={p.hidden ? "Показать" : "Скрыть"}>
                    {p.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setEditing(p.id)}><Pencil size={16} /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Удалить товар?")) deleteProduct(p.id); }}><Trash2 size={16} /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Orders Tab ─── */
const OrdersTab = () => {
  const { orders, toggleProcessed } = useOrders();
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Заявок пока нет</p>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Город</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead className="text-center">Статус</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o, i) => (
                <TableRow key={o.id} className={o.processed ? "opacity-60" : ""}>
                  <TableCell className="text-muted-foreground text-xs">{orders.length - i}</TableCell>
                  <TableCell className="text-sm">{new Date(o.createdAt).toLocaleDateString("ru-RU")}</TableCell>
                  <TableCell className="font-medium text-sm">{o.name}</TableCell>
                  <TableCell className="text-sm">{o.phone}</TableCell>
                  <TableCell className="text-sm">{o.city || "—"}</TableCell>
                  <TableCell className="text-right text-sm font-semibold">{formatPrice(o.total)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={o.processed ? "secondary" : "default"} className="cursor-pointer text-xs" onClick={() => toggleProcessed(o.id)}>
                      {o.processed ? "Обработана" : "Новая"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelected(o)}>Открыть</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Заявка от {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Телефон:</span> <span className="font-medium">{selected.phone}</span></div>
                <div><span className="text-muted-foreground">Город:</span> <span className="font-medium">{selected.city || "—"}</span></div>
                <div><span className="text-muted-foreground">Дата:</span> <span className="font-medium">{new Date(selected.createdAt).toLocaleString("ru-RU")}</span></div>
                <div><span className="text-muted-foreground">Статус:</span> <Badge variant={selected.processed ? "secondary" : "default"} className="text-xs ml-1">{selected.processed ? "Обработана" : "Новая"}</Badge></div>
              </div>

              <div>
                <p className="font-medium mb-2">Состав заказа:</p>
                <div className="rounded-md border divide-y">
                  {selected.items.map((item) => (
                    <div key={item.id} className="px-3 py-2 flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground ml-2">× {item.quantity}</span>
                        <span className="text-muted-foreground ml-2">({periodLabels[item.period]})</span>
                      </div>
                      <span className="font-semibold">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-semibold">Итого:</span>
                <span className="text-lg font-bold text-primary">{formatPrice(selected.total)}</span>
              </div>

              <Button onClick={() => { toggleProcessed(selected.id); setSelected({ ...selected, processed: !selected.processed }); }} variant={selected.processed ? "outline" : "default"} className="w-full">
                {selected.processed ? "Вернуть в новые" : "Отметить как обработанную"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ─── Settings Tab ─── */
const SettingsTab = () => {
  const { heroImageUrl, uploadHeroImage, removeHeroImage } = useSiteSettings();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadHeroImage(file);
      toast.success("Hero-изображение обновлено");
    } catch (err: any) {
      toast.error("Ошибка загрузки: " + (err.message || "Попробуйте снова"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <ImageIcon size={18} /> Hero-изображение
        </h3>
        <p className="text-sm text-muted-foreground">
          Это фото отображается в главном блоке на первом экране сайта.
        </p>

        {heroImageUrl ? (
          <div className="space-y-3">
            <img src={heroImageUrl} alt="Hero" className="w-full max-w-xs rounded-lg border object-cover aspect-[4/5]" />
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" className="gap-1.5 pointer-events-none" asChild>
                  <span><Upload size={14} /> Заменить</span>
                </Button>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>
              <Button variant="ghost" size="sm" className="gap-1.5 text-destructive" onClick={removeHeroImage}>
                <Trash2 size={14} /> Удалить
              </Button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-8 cursor-pointer hover:bg-muted/50 transition-colors">
            <Upload size={32} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{uploading ? "Загрузка…" : "Нажмите, чтобы загрузить фото"}</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
};

/* ─── Admin Page ─── */
const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Загрузка…</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-lg font-semibold text-foreground">Доступ запрещён</p>
        <p className="text-sm text-muted-foreground">У вас нет прав администратора</p>
        <Button variant="outline" onClick={signOut} className="gap-2"><LogOut size={16} /> Выйти</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/95 backdrop-blur">
        <div className="container flex h-14 items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-semibold text-foreground flex-1">Управление товарами и заявками</h1>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 text-muted-foreground">
            <LogOut size={16} /> Выйти
          </Button>
        </div>
      </header>

      <main className="container py-6">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="orders">Заявки</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;

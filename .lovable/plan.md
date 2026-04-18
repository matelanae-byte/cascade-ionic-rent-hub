

## Plan: Statuses for orders + Dashboard counters

### 1. Order statuses (4 values)
Replace the boolean `processed` semantics with an explicit status field with 4 values:
- `new` — Новая
- `in_progress` — В работе
- `delivered` — Доставлена
- `cancelled` — Отменена

**Database migration:**
- Add `status text not null default 'new'` column to `public.orders`.
- Add CHECK-style validation via trigger (per project rules — no immutable CHECK needed here, plain CHECK on enum-like text is fine since it's immutable; will use a simple `CHECK (status IN (...))`).
- Backfill: existing rows with `processed = true` → `status = 'delivered'`, else `status = 'new'`.
- Keep `processed` column for now (no breaking change), but stop using it in UI.

**Code:**
- `src/contexts/OrdersContext.tsx`: add `status` to `Order` interface, map from row, add `updateStatus(id, status)` method. Keep `toggleProcessed` for backward-compat or remove.
- `src/pages/Admin.tsx` (`OrdersTab`):
  - In the list, replace the "Новая/Обработана" badge with a colored badge showing the current status (4 colors).
  - In the order details Dialog, replace the single toggle button with a status selector (4 buttons or a Select) that calls `updateStatus`.

### 2. Dashboard tab with counters
Add a new **"Дашборд"** tab (first tab, default) to `Admin.tsx`:
- 4 stat cards showing counts of orders by status (Новая / В работе / Доставлена / Отменена).
- Plus a small "Всего заявок" card.
- Computed from `orders` array in `OrdersContext`.

### 3. Products tab — verification
Current `ProductsTab` already supports:
- Add (`Добавить товар` button → `ProductForm` → `addProduct`)
- Edit (pencil icon → inline `ProductForm` → `updateProduct`)
- Delete, hide/show, reorder, image upload

This works correctly. No changes needed — will just confirm in the response. (Note: products are still stored in `localStorage` via `ProductsContext`, not the DB. That's a separate larger refactor — not requested here, won't touch it.)

### Files to change
- New migration: add `status` column + backfill
- `src/contexts/OrdersContext.tsx` — add status field & `updateStatus`
- `src/pages/Admin.tsx` — add Dashboard tab, status badge in list, status selector in dialog
- `src/integrations/supabase/types.ts` — auto-regenerated

### Status color mapping
- new → default (teal/primary)
- in_progress → secondary (gray-blue)
- delivered → outline green
- cancelled → destructive (red)


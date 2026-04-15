

## Plan: Generate products with photos for all categories

### Current state
- Products stored in localStorage via `ProductsContext`
- 4 categories: Комплекты, Штанги, Системы подачи воды, Доп. оборудование
- 6 products total, no photos
- Images stored as base64 strings (problematic for localStorage size limits)

### What will be done

**1. Create a storage bucket for product images**
- SQL migration to create a public `product-images` bucket
- RLS policy allowing public read access

**2. Generate product images using AI**
- Edge function that calls Lovable AI (gemini-2.5-flash-image) to generate realistic product photos for each item
- Upload generated images to the storage bucket
- Return public URLs

**3. Expand the product catalog to ~12-15 items**
Add 2-3 products per category:

- **Комплекты**: Kit 15m (existing), Kit 20m, Kit 10m starter
- **Штанги**: 12m carbon (existing), 15m carbon (existing), 18m carbon, 8m fiberglass
- **Системы подачи воды**: Water station (existing), compact water station, mobile filtration
- **Доп. оборудование**: Chem pump (existing), hose reel (existing), brush set, trolley cart, safety harness

**4. Update `ProductsContext.tsx`**
- Expand `defaultProducts` array with new items, each with a public image URL from the storage bucket
- Add new icon mappings as needed

### Technical details
- Images generated as ~600x400 product photos on white/neutral background
- Stored in `product-images` bucket with public URLs
- Edge function is temporary (used once to generate, then deleted)
- localStorage will be cleared/reset so new defaults load

### Files to create/edit
- **Migration**: Create `product-images` storage bucket
- **Edge function**: `generate-product-images` (temporary)
- **`src/contexts/ProductsContext.tsx`**: Expanded product list with image URLs


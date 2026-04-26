ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS task_type   text,
  ADD COLUMN IF NOT EXISTS area        text,
  ADD COLUMN IF NOT EXISTS people      text,
  ADD COLUMN IF NOT EXISTS height      text,
  ADD COLUMN IF NOT EXISTS rental_term text,
  ADD COLUMN IF NOT EXISTS comment     text;
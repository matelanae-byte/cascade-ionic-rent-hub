ALTER TABLE public.orders
ADD COLUMN status text NOT NULL DEFAULT 'new'
CHECK (status IN ('new', 'in_progress', 'delivered', 'cancelled'));

UPDATE public.orders
SET status = CASE WHEN processed = true THEN 'delivered' ELSE 'new' END;
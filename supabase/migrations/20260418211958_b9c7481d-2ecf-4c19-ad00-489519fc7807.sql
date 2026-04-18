
CREATE TABLE public.chat_tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'ai',
  unread_admin boolean NOT NULL DEFAULT true,
  order_id uuid,
  last_message_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid NOT NULL REFERENCES public.chat_tickets(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_ticket ON public.chat_messages(ticket_id, created_at);
CREATE INDEX idx_chat_tickets_last_message ON public.chat_tickets(last_message_at DESC);

ALTER TABLE public.chat_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Admins: full access
CREATE POLICY "Admins can read tickets" ON public.chat_tickets
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tickets" ON public.chat_tickets
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tickets" ON public.chat_tickets
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can read messages" ON public.chat_messages
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert messages" ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update messages" ON public.chat_messages
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Public: realtime read of own ticket messages by ticket_id (client knows id from localStorage).
-- Tickets table itself is not directly readable; client uses edge function for ticket data.
CREATE POLICY "Public can read messages by ticket id" ON public.chat_messages
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read own ticket" ON public.chat_tickets
  FOR SELECT TO anon, authenticated
  USING (true);

-- Updated_at triggers
CREATE TRIGGER update_chat_tickets_updated_at
  BEFORE UPDATE ON public.chat_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER TABLE public.chat_tickets REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

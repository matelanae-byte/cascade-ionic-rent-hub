import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Headphones, ShoppingCart, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "operator" | "system";
  content: string;
  created_at: string;
}

interface ChatTicket {
  id: string;
  name: string;
  phone: string;
  status: "ai" | "waiting_operator" | "operator" | "closed";
  order_id: string | null;
}

const TICKET_KEY = "cascade_chat_ticket_id";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-ai`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function callFn(body: Record<string, unknown>) {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ANON}`, apikey: ANON },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Ошибка сервера");
  return data;
}

const periodLabel: Record<string, string> = { day: "день", week: "неделя", month: "месяц" };

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState<ChatTicket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { items, total, clearCart } = useCart();

  // Load existing ticket from localStorage
  useEffect(() => {
    const id = localStorage.getItem(TICKET_KEY);
    if (!id) return;
    (async () => {
      try {
        const { ticket: t, messages: m } = await callFn({ action: "get_ticket", ticketId: id });
        setTicket(t);
        setMessages(m);
      } catch {
        localStorage.removeItem(TICKET_KEY);
      }
    })();
  }, []);

  // Realtime subscription on messages for current ticket
  useEffect(() => {
    if (!ticket) return;
    const ch = supabase
      .channel(`chat-${ticket.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `ticket_id=eq.${ticket.id}` },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === (payload.new as ChatMessage).id)) return prev;
            return [...prev, payload.new as ChatMessage];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chat_tickets", filter: `id=eq.${ticket.id}` },
        (payload) => {
          setTicket((t) => (t ? { ...t, ...(payload.new as ChatTicket) } : t));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [ticket?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const startChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      toast.error("Подтвердите согласие с политикой");
      return;
    }
    setLoading(true);
    try {
      const { ticket: t } = await callFn({ action: "create_ticket", name, phone });
      localStorage.setItem(TICKET_KEY, t.id);
      setTicket(t);
      const { messages: m } = await callFn({ action: "get_ticket", ticketId: t.id });
      setMessages(m);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не удалось начать чат");
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || !ticket || sending) return;
    setSending(true);
    setInput("");
    // Optimistic
    setMessages((prev) => [
      ...prev,
      { id: `tmp-${Date.now()}`, role: "user", content: text, created_at: new Date().toISOString() },
    ]);
    try {
      await callFn({ action: "send_message", ticketId: ticket.id, content: text });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не удалось отправить");
    } finally {
      setSending(false);
    }
  };

  const requestOperator = async () => {
    if (!ticket) return;
    try {
      await callFn({ action: "request_operator", ticketId: ticket.id });
      toast.success("Оператор скоро подключится");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка");
    }
  };

  const submitOrder = async () => {
    if (!ticket) return;
    if (items.length === 0) {
      toast.error("Корзина пуста — добавьте товары на сайте");
      return;
    }
    try {
      await callFn({
        action: "create_order",
        ticketId: ticket.id,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          period: i.period,
          price: i.price,
        })),
        total,
        city: "—",
      });
      clearCart();
      toast.success("Заявка оформлена!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка оформления");
    }
  };

  const resetChat = () => {
    localStorage.removeItem(TICKET_KEY);
    setTicket(null);
    setMessages([]);
    setName("");
    setPhone("");
    setAgree(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Открыть чат"
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-[380px] h-[560px] max-h-[calc(100vh-7rem)] rounded-2xl border bg-card shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Чат с консультантом</p>
              <p className="text-xs opacity-80">
                {!ticket
                  ? "Подберём оборудование под задачу"
                  : ticket.status === "ai"
                  ? "ИИ-консультант на связи"
                  : ticket.status === "waiting_operator"
                  ? "Ожидание оператора…"
                  : ticket.status === "operator"
                  ? "Оператор на связи"
                  : "Чат закрыт"}
              </p>
            </div>
            {ticket && (
              <button
                onClick={resetChat}
                className="text-xs opacity-80 hover:opacity-100 underline"
                title="Начать новый чат"
              >
                Новый
              </button>
            )}
          </div>

          {/* Body */}
          {!ticket ? (
            <form onSubmit={startChat} className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
              <p className="text-sm text-foreground">
                Здравствуйте! Заполните форму, чтобы начать диалог. Мы поможем подобрать оборудование для мойки фасадов и остекления.
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Ваше имя</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={60} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Телефон</label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+7 ___ ___ __ __"
                  maxLength={20}
                />
              </div>
              <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} className="mt-0.5" />
                <span>
                  Согласен с{" "}
                  <Link to="/privacy" className="text-primary underline" target="_blank">
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
              <Button type="submit" disabled={loading} className="mt-auto">
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Начать чат"}
              </Button>
            </form>
          ) : (
            <>
              {/* Action bar */}
              <div className="flex gap-2 px-3 py-2 border-b bg-muted/30">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={requestOperator}
                  disabled={ticket.status === "waiting_operator" || ticket.status === "operator"}
                  className="flex-1 gap-1.5 text-xs h-8"
                >
                  <Headphones size={14} /> Оператор
                </Button>
                <Button
                  size="sm"
                  onClick={submitOrder}
                  disabled={items.length === 0 || !!ticket.order_id}
                  className="flex-1 gap-1.5 text-xs h-8"
                >
                  <ShoppingCart size={14} />
                  {ticket.order_id ? "Оформлено" : `Оформить (${items.length})`}
                </Button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-background">
                {messages.map((m) => {
                  if (m.role === "system") {
                    return (
                      <div key={m.id} className="text-center text-xs text-muted-foreground py-1">
                        {m.content}
                      </div>
                    );
                  }
                  const isUser = m.role === "user";
                  return (
                    <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                          isUser
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : m.role === "operator"
                            ? "bg-emerald-100 text-emerald-950 rounded-bl-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                        }`}
                      >
                        {m.role === "operator" && (
                          <p className="text-[10px] uppercase tracking-wide opacity-70 mb-1">Оператор</p>
                        )}
                        <div className="prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_strong]:font-semibold prose-headings:text-inherit prose-strong:text-inherit">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-3 py-2 text-sm text-muted-foreground">
                      <Loader2 className="animate-spin inline" size={14} /> печатает…
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="border-t p-2 flex gap-2 bg-card"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Напишите сообщение…"
                  disabled={sending || ticket.status === "closed"}
                  maxLength={1000}
                />
                <Button type="submit" size="icon" disabled={sending || !input.trim()}>
                  <Send size={16} />
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

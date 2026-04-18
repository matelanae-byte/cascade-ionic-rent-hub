import { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Send, UserCog, Bot, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Ticket {
  id: string;
  name: string;
  phone: string;
  status: "ai" | "waiting_operator" | "operator" | "closed";
  unread_admin: boolean;
  order_id: string | null;
  last_message_at: string;
  created_at: string;
}

interface Msg {
  id: string;
  ticket_id: string;
  role: "user" | "assistant" | "operator" | "system";
  content: string;
  created_at: string;
}

const STATUS_LABEL: Record<Ticket["status"], string> = {
  ai: "ИИ",
  waiting_operator: "Ждёт оператора",
  operator: "Оператор",
  closed: "Закрыт",
};

const STATUS_CLS: Record<Ticket["status"], string> = {
  ai: "bg-primary/15 text-primary border-primary/30",
  waiting_operator: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  operator: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  closed: "bg-muted text-muted-foreground border-border",
};

export const ChatsTab = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchTickets = useCallback(async () => {
    const { data } = await supabase
      .from("chat_tickets")
      .select("*")
      .order("last_message_at", { ascending: false });
    setTickets((data ?? []) as Ticket[]);
  }, []);

  const fetchMessages = useCallback(async (id: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at");
    setMessages((data ?? []) as Msg[]);
  }, []);

  useEffect(() => {
    fetchTickets();
    const ch = supabase
      .channel("admin-chats")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_tickets" }, () => fetchTickets())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
        const m = payload.new as Msg;
        setMessages((prev) => (prev.some((x) => x.id === m.id) || m.ticket_id !== selectedId ? prev : [...prev, m]));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [fetchTickets, selectedId]);

  useEffect(() => {
    if (selectedId) {
      fetchMessages(selectedId);
      // mark as read
      supabase.from("chat_tickets").update({ unread_admin: false }).eq("id", selectedId).then(() => fetchTickets());
    } else {
      setMessages([]);
    }
  }, [selectedId, fetchMessages, fetchTickets]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const selected = tickets.find((t) => t.id === selectedId) || null;

  const sendReply = async () => {
    const text = reply.trim();
    if (!text || !selected || sending) return;
    setSending(true);
    try {
      const { error } = await supabase
        .from("chat_messages")
        .insert({ ticket_id: selected.id, role: "operator", content: text });
      if (error) throw error;
      await supabase
        .from("chat_tickets")
        .update({ last_message_at: new Date().toISOString(), unread_admin: false })
        .eq("id", selected.id);
      setReply("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setSending(false);
    }
  };

  const setStatus = async (status: Ticket["status"]) => {
    if (!selected) return;
    await supabase.from("chat_tickets").update({ status }).eq("id", selected.id);
    if (status === "operator") {
      await supabase.from("chat_messages").insert({
        ticket_id: selected.id,
        role: "system",
        content: "Оператор подключился к диалогу.",
      });
    }
    if (status === "ai") {
      await supabase.from("chat_messages").insert({
        ticket_id: selected.id,
        role: "system",
        content: "Диалог снова ведёт ИИ-консультант.",
      });
    }
    if (status === "closed") {
      await supabase.from("chat_messages").insert({
        ticket_id: selected.id,
        role: "system",
        content: "Чат закрыт.",
      });
    }
    toast.success("Статус обновлён");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-220px)] min-h-[500px]">
      {/* List */}
      <div className="rounded-lg border bg-card overflow-y-auto">
        {tickets.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground text-center">Чатов пока нет</p>
        ) : (
          <ul className="divide-y">
            {tickets.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setSelectedId(t.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                    selectedId === t.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">{t.name}</span>
                    {t.unread_admin && selectedId !== t.id && (
                      <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.phone}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className={`text-[10px] ${STATUS_CLS[t.status]}`}>
                      {STATUS_LABEL[t.status]}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(t.last_message_at).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Conversation */}
      <div className="rounded-lg border bg-card flex flex-col overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Выберите чат слева
          </div>
        ) : (
          <>
            <div className="border-b px-4 py-3 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold text-sm">{selected.name}</p>
                <p className="text-xs text-muted-foreground">{selected.phone}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {selected.status !== "operator" && (
                  <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={() => setStatus("operator")}>
                    <UserCog size={14} /> Взять в работу
                  </Button>
                )}
                {selected.status !== "ai" && selected.status !== "closed" && (
                  <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={() => setStatus("ai")}>
                    <Bot size={14} /> Вернуть ИИ
                  </Button>
                )}
                {selected.status !== "closed" && (
                  <Button size="sm" variant="ghost" className="gap-1.5 h-8" onClick={() => setStatus("closed")}>
                    <X size={14} /> Закрыть
                  </Button>
                )}
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
              {messages.map((m) => {
                if (m.role === "system") {
                  return (
                    <div key={m.id} className="text-center text-xs text-muted-foreground py-1">
                      {m.content}
                    </div>
                  );
                }
                const fromAdmin = m.role === "operator" || m.role === "assistant";
                return (
                  <div key={m.id} className={`flex ${fromAdmin ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                        m.role === "operator"
                          ? "bg-emerald-600 text-white rounded-br-sm"
                          : m.role === "assistant"
                          ? "bg-primary/10 text-foreground rounded-br-sm border border-primary/20"
                          : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                    >
                      <p className="text-[10px] uppercase tracking-wide opacity-70 mb-0.5">
                        {m.role === "user" ? selected.name : m.role === "operator" ? "Оператор" : "ИИ"}
                      </p>
                      <div className="prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 prose-strong:text-inherit">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendReply();
              }}
              className="border-t p-2 flex gap-2"
            >
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Ответ оператора…"
                disabled={sending || selected.status === "closed"}
                maxLength={2000}
              />
              <Button type="submit" size="icon" disabled={sending || !reply.trim()}>
                {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

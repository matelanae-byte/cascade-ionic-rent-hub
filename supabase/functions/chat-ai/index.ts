// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

async function notifyTelegram(payload: Record<string, unknown>) {
  try {
    const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/notify-telegram`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("notifyTelegram failed", e);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function buildSystemPrompt(): Promise<string> {
  const { data: products } = await supabase
    .from("products")
    .select("name,category,description,price_day,price_week,price_month")
    .eq("hidden", false)
    .order("sort_order");

  const catalog = (products ?? [])
    .map(
      (p) =>
        `- ${p.name} (${p.category}). ${p.description || ""} Цены: день ${p.price_day}₽, неделя ${p.price_week}₽, месяц ${p.price_month}₽.`
    )
    .join("\n");

  return `Ты — консультант компании cascade ionic по аренде оборудования для мойки фасадов и остекления по технологии WFP (water-fed pole, чистая вода через карбоновые телескопические штанги).

ТВОЯ ЗАДАЧА: помочь клиенту подобрать подходящий комплект или оборудование строго из нашего каталога ниже.

КАТАЛОГ:
${catalog || "(каталог пуст)"}

ПРАВИЛА:
1. Сначала задай 2 ключевых вопроса (если ещё не знаешь): тип задачи (мойка фасада / остекление / другое) и высота объекта в метрах.
2. После этого предложи 1–3 подходящих позиции из каталога с короткой аргументацией и ценой.
3. Отвечай ТОЛЬКО по теме аренды нашего оборудования. На посторонние вопросы вежливо возвращай к теме.
4. Кратко, по делу, на русском. Используй markdown-списки где уместно.
5. Когда подбор готов — предложи оформить заявку фразой «Готов оформить заявку?».
6. Если не уверен или клиент хочет человека — предложи нажать кнопку «Позвать оператора».`;
}

async function callAI(messages: { role: string; content: string }[]): Promise<string> {
  const systemPrompt = await buildSystemPrompt();
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });
  if (resp.status === 429) throw new Error("RATE_LIMIT");
  if (resp.status === 402) throw new Error("PAYMENT");
  if (!resp.ok) {
    const t = await resp.text();
    console.error("AI error", resp.status, t);
    throw new Error("AI_ERROR");
  }
  const data = await resp.json();
  return data.choices?.[0]?.message?.content ?? "Извините, не удалось сформировать ответ.";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, ticketId, name, phone, content, items, total, city } = await req.json();

    if (action === "create_ticket") {
      if (!name || !phone || String(name).trim().length < 2 || String(phone).trim().length < 5) {
        return json({ error: "Имя и телефон обязательны" }, 400);
      }
      const { data: ticket, error } = await supabase
        .from("chat_tickets")
        .insert({ name: String(name).trim(), phone: String(phone).trim(), status: "ai", unread_admin: true })
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);

      // Greeting from AI
      const greeting =
        "Здравствуйте! Я подберу оборудование для мойки фасадов и остекления. Подскажите, пожалуйста: **какая задача** (мойка фасада / остекления / другое) и **высота объекта** в метрах?";
      await supabase.from("chat_messages").insert({ ticket_id: ticket.id, role: "assistant", content: greeting });
      await supabase.from("chat_tickets").update({ last_message_at: new Date().toISOString() }).eq("id", ticket.id);

      notifyTelegram({ type: "new_ticket", name: ticket.name, phone: ticket.phone, ticketId: ticket.id });

      return json({ ticket });
    }

    if (action === "get_ticket") {
      if (!ticketId) return json({ error: "ticketId required" }, 400);
      const { data: ticket } = await supabase.from("chat_tickets").select("*").eq("id", ticketId).maybeSingle();
      if (!ticket) return json({ error: "not found" }, 404);
      const { data: messages } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at");
      return json({ ticket, messages: messages ?? [] });
    }

    if (action === "send_message") {
      if (!ticketId || !content) return json({ error: "ticketId & content required" }, 400);
      const { data: ticket } = await supabase.from("chat_tickets").select("*").eq("id", ticketId).maybeSingle();
      if (!ticket) return json({ error: "ticket not found" }, 404);

      await supabase.from("chat_messages").insert({ ticket_id: ticketId, role: "user", content: String(content) });
      await supabase
        .from("chat_tickets")
        .update({ last_message_at: new Date().toISOString(), unread_admin: true })
        .eq("id", ticketId);

      notifyTelegram({
        type: "new_message",
        name: ticket.name,
        phone: ticket.phone,
        content: String(content),
      });

      // Only AI replies if status === 'ai'
      if (ticket.status === "ai") {
        const { data: history } = await supabase
          .from("chat_messages")
          .select("role,content")
          .eq("ticket_id", ticketId)
          .order("created_at");

        const aiHistory = (history ?? [])
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ role: m.role, content: m.content }));

        try {
          const reply = await callAI(aiHistory);
          await supabase.from("chat_messages").insert({ ticket_id: ticketId, role: "assistant", content: reply });
          await supabase.from("chat_tickets").update({ last_message_at: new Date().toISOString() }).eq("id", ticketId);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "AI_ERROR";
          let userMsg = "Извините, сейчас не могу ответить. Переключаю на оператора.";
          if (msg === "RATE_LIMIT") userMsg = "Сейчас высокая нагрузка. Переключаю на оператора — он ответит в ближайшее время.";
          if (msg === "PAYMENT") userMsg = "Сервис временно недоступен. Переключаю на оператора.";
          await supabase.from("chat_messages").insert({ ticket_id: ticketId, role: "system", content: userMsg });
          await supabase
            .from("chat_tickets")
            .update({ status: "waiting_operator", last_message_at: new Date().toISOString(), unread_admin: true })
            .eq("id", ticketId);
        }
      }

      return json({ ok: true });
    }

    if (action === "request_operator") {
      if (!ticketId) return json({ error: "ticketId required" }, 400);
      const { data: ticket } = await supabase.from("chat_tickets").select("*").eq("id", ticketId).maybeSingle();
      await supabase
        .from("chat_tickets")
        .update({ status: "waiting_operator", unread_admin: true, last_message_at: new Date().toISOString() })
        .eq("id", ticketId);
      await supabase.from("chat_messages").insert({
        ticket_id: ticketId,
        role: "system",
        content: "Запрос передан оператору. С вами скоро свяжется живой консультант.",
      });
      if (ticket) {
        notifyTelegram({ type: "operator_request", name: ticket.name, phone: ticket.phone });
      }
      return json({ ok: true });
    }

    if (action === "create_order") {
      if (!ticketId || !Array.isArray(items) || items.length === 0) {
        return json({ error: "ticketId & items required" }, 400);
      }
      const { data: ticket } = await supabase.from("chat_tickets").select("*").eq("id", ticketId).maybeSingle();
      if (!ticket) return json({ error: "ticket not found" }, 404);

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          name: ticket.name,
          phone: ticket.phone,
          city: city || "—",
          items,
          total: Number(total) || 0,
          status: "new",
        })
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);

      await supabase.from("chat_tickets").update({ order_id: order.id }).eq("id", ticketId);
      await supabase.from("chat_messages").insert({
        ticket_id: ticketId,
        role: "system",
        content: `Заявка №${order.id.slice(0, 8)} оформлена. С вами свяжется менеджер.`,
      });
      return json({ ok: true, orderId: order.id });
    }

    return json({ error: "unknown action" }, 400);
  } catch (e) {
    console.error("chat-ai error", e);
    return json({ error: e instanceof Error ? e.message : "unknown" }, 500);
  }
});

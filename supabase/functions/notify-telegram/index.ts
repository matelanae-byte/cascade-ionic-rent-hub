// @ts-nocheck
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendTelegram(text: string): Promise<{ ok: boolean; error?: string }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
  const CHAT_ID = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID");
  if (!LOVABLE_API_KEY) return { ok: false, error: "LOVABLE_API_KEY missing" };
  if (!TELEGRAM_API_KEY) return { ok: false, error: "TELEGRAM_API_KEY missing" };
  if (!CHAT_ID) return { ok: false, error: "TELEGRAM_ADMIN_CHAT_ID missing" };

  const resp = await fetch(`${GATEWAY_URL}/sendMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": TELEGRAM_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!resp.ok) {
    const t = await resp.text();
    console.error("Telegram error", resp.status, t);
    return { ok: false, error: `${resp.status}: ${t}` };
  }
  return { ok: true };
}

function buildText(payload: any): string {
  const { type, name, phone, content, orderId, items, total, city, ticketId,
          taskType, area, people, height, rentalTerm, comment } = payload ?? {};
  const safeName = escapeHtml(name || "—");
  const safePhone = escapeHtml(phone || "—");

  if (type === "order") {
    const lines = Array.isArray(items)
      ? items
          .map(
            (i: any) =>
              `• ${escapeHtml(i.name)} ×${i.quantity} (${escapeHtml(i.period || "")}) — ${i.price}₽`
          )
          .join("\n")
      : "";
    const params = [
      taskType ? `• Тип задачи: ${escapeHtml(taskType)}` : "",
      area ? `• Площадь: ${escapeHtml(area)}` : "",
      people ? `• Человек: ${escapeHtml(people)}` : "",
      height ? `• Высота: ${escapeHtml(height)}` : "",
      rentalTerm ? `• Срок аренды: ${escapeHtml(rentalTerm)}` : "",
    ].filter(Boolean).join("\n");
    return [
      `🧾 <b>Новая ЗАЯВКА с сайта</b> (сохранена в админке)${orderId ? ` №${escapeHtml(String(orderId).slice(0, 8))}` : ""}`,
      `<b>Имя:</b> ${safeName}`,
      `<b>Телефон:</b> ${safePhone}`,
      city ? `<b>Город:</b> ${escapeHtml(city)}` : "",
      params ? `\n<b>Параметры подбора:</b>\n${params}` : "",
      lines ? `\n<b>Состав:</b>\n${lines}` : "",
      total != null && total > 0 ? `\n<b>Итого:</b> ${total}₽` : "",
      comment ? `\n<b>Комментарий:</b>\n${escapeHtml(comment)}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (type === "new_ticket") {
    return [
      `💬 <b>Новый чат</b>`,
      `<b>Имя:</b> ${safeName}`,
      `<b>Телефон:</b> ${safePhone}`,
      ticketId ? `\n<i>ID:</i> ${escapeHtml(String(ticketId).slice(0, 8))}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (type === "new_message") {
    return [
      `✉️ <b>Новое сообщение в чате</b>`,
      `<b>Имя:</b> ${safeName}`,
      `<b>Телефон:</b> ${safePhone}`,
      content ? `\n<b>Сообщение:</b>\n${escapeHtml(content)}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (type === "operator_request") {
    return [
      `🆘 <b>Клиент просит оператора</b>`,
      `<b>Имя:</b> ${safeName}`,
      `<b>Телефон:</b> ${safePhone}`,
    ].join("\n");
  }

  return `🔔 Уведомление\n${escapeHtml(JSON.stringify(payload))}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const payload = await req.json();
    const text = buildText(payload);
    const result = await sendTelegram(text);
    return new Response(JSON.stringify(result), {
      status: result.ok ? 200 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-telegram error", e);
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

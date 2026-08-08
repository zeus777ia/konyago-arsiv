/**
 * App emails — sender identity: info@konyago.com.tr
 *
 * 1) EmailJS when VITE_EMAILJS_* is set (custom SMTP / domain).
 * 2) Otherwise FormSubmit to the user, with _replyto = info@konyago.com.tr
 *    (recipient may need to confirm the first FormSubmit activation mail).
 */

export const FROM_EMAIL = "info@konyago.com.tr";
export const FROM_NAME = "KonyaGo Arşiv";
export const SITE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://konyagoarsiv.org";

export type MailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type MailResult =
  | { ok: true; provider: string }
  | { ok: false; error: string };

function env(key: string): string | undefined {
  const v = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.[
    key
  ];
  return v && v.length > 0 ? v : undefined;
}

function escapeHtml(s: string): string {
  const map: Record<string, string> = {
    "&": "&" + "amp;",
    "<": "&" + "lt;",
    ">": "&" + "gt;",
    '"': "&" + "quot;",
  };
  return s.replace(/[&<>"]/g, (ch) => map[ch] ?? ch);
}

async function sendViaEmailJS(payload: MailPayload): Promise<MailResult | null> {
  const serviceId = env("VITE_EMAILJS_SERVICE_ID");
  const templateId = env("VITE_EMAILJS_TEMPLATE_ID");
  const publicKey = env("VITE_EMAILJS_PUBLIC_KEY");
  if (!serviceId || !templateId || !publicKey) return null;

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          to_email: payload.to,
          from_name: FROM_NAME,
          from_email: FROM_EMAIL,
          reply_to: FROM_EMAIL,
          subject: payload.subject,
          message: payload.text,
          message_html: payload.html ?? payload.text,
        },
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return { ok: false, error: t || `EmailJS hata (${res.status})` };
    }
    return { ok: true, provider: "emailjs" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "EmailJS hata" };
  }
}

async function sendViaFormSubmit(payload: MailPayload): Promise<MailResult> {
  try {
    const res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(payload.to)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: FROM_NAME,
          email: FROM_EMAIL,
          _replyto: FROM_EMAIL,
          _subject: payload.subject,
          _template: "table",
          _captcha: "false",
          message:
            payload.text +
            "\n\n---\nGönderen: " +
            FROM_NAME +
            " <" +
            FROM_EMAIL +
            ">\nSite: " +
            SITE_URL,
        }),
      },
    );
    const data = (await res.json().catch(() => ({}))) as {
      success?: string | boolean;
      message?: string;
    };
    if (!res.ok) {
      return {
        ok: false,
        error: data.message || `E-posta gönderilemedi (${res.status})`,
      };
    }
    return { ok: true, provider: "formsubmit" };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "E-posta ağı hatası",
    };
  }
}

export async function sendAppEmail(payload: MailPayload): Promise<MailResult> {
  const viaJs = await sendViaEmailJS(payload);
  if (viaJs) return viaJs;
  return sendViaFormSubmit(payload);
}

export function welcomeEmail(input: {
  displayName: string;
  email: string;
}): MailPayload {
  const subject = "KonyaGo Arşiv'e hoş geldiniz";
  const text = [
    "Merhaba " + input.displayName + ",",
    "",
    "KonyaGo Arşiv topluluğuna katıldığın için teşekkürler.",
    "",
    "Hesabın oluşturuldu.",
    "E-posta: " + input.email,
    "Site: " + SITE_URL,
    "",
    "Bu platform bağımsız bir topluluk arşividir; resmi bir kamu kurumu veya belediye sitesi değildir.",
    "",
    "İyi forumlar dileriz.",
    FROM_NAME,
    FROM_EMAIL,
  ].join("\n");

  const name = escapeHtml(input.displayName);
  const mail = escapeHtml(input.email);
  const html =
    '<div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.5;color:#1a1a1a">' +
    '<h2 style="color:#0f6b52;margin:0 0 12px">Aramıza hoş geldin, ' +
    name +
    "!</h2>" +
    "<p>KonyaGo Arşiv hesabın hazır. Forum, ikinci el ve iş panosunu kullanmaya başlayabilirsin.</p>" +
    "<p><strong>E-posta:</strong> " +
    mail +
    "<br/><strong>Site:</strong> <a href=\"" +
    SITE_URL +
    '">' +
    SITE_URL +
    "</a></p>" +
    '<p style="font-size:13px;color:#555">Bu platform bağımsız bir topluluk arşividir; resmi bir kamu kurumu veya belediye sitesi değildir.</p>' +
    '<p style="margin-top:24px">İyi forumlar,<br/><strong>' +
    FROM_NAME +
    "</strong><br/><a href=\"mailto:" +
    FROM_EMAIL +
    '">' +
    FROM_EMAIL +
    "</a></p></div>";

  return { to: input.email, subject, text, html };
}

export function resetPasswordEmail(input: {
  displayName: string;
  email: string;
  code: string;
}): MailPayload {
  const subject = "Şifre sıfırlama kodu — KonyaGo Arşiv";
  const text = [
    "Merhaba " + input.displayName + ",",
    "",
    "Şifre sıfırlama talebin alındı.",
    "",
    "Doğrulama kodun: " + input.code,
    "",
    "Bu kod 30 dakika geçerlidir. Talebi sen yapmadıysan bu e-postayı yok say.",
    "",
    "Giriş: " + SITE_URL + "/login",
    "Destek: " + FROM_EMAIL,
    "",
    FROM_NAME,
  ].join("\n");

  const name = escapeHtml(input.displayName);
  const code = escapeHtml(input.code);
  const html =
    '<div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.5;color:#1a1a1a">' +
    '<h2 style="color:#0f6b52;margin:0 0 12px">Şifre sıfırlama</h2>' +
    "<p>Merhaba " +
    name +
    ",</p>" +
    "<p>Şifre sıfırlama talebin alındı. Aşağıdaki kodu giriş ekranındaki “Şifremi unuttum” adımına gir:</p>" +
    '<p style="font-size:28px;letter-spacing:6px;font-weight:700;color:#0f6b52;margin:16px 0">' +
    code +
    "</p>" +
    '<p style="font-size:13px;color:#555">Kod 30 dakika geçerlidir. Talebi sen yapmadıysan bu e-postayı yok sayabilirsin.</p>' +
    '<p><a href="' +
    SITE_URL +
    '/login">Giriş paneli</a> · <a href="mailto:' +
    FROM_EMAIL +
    '">' +
    FROM_EMAIL +
    "</a></p></div>";

  return { to: input.email, subject, text, html };
}

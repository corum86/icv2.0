/**
 * Vercel Function: POST /api/contact
 * Sends contact-form messages via Resend (https://resend.com).
 * Env: RESEND_API_KEY (required), CONTACT_TO (default ser.corum@gmail.com), CONTACT_FROM (verified sender on your domain).
 */
const MAX = { name: 120, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return json(400, { ok: false, error: 'invalid_json' }); }

  // Honeypot: bots fill hidden fields. Pretend success.
  if (typeof data['bot-field'] === 'string' && data['bot-field'].trim()) return json(200, { ok: true });

  const name = String(data.name ?? '').trim();
  const email = String(data.email ?? '').trim();
  const message = String(data.message ?? '').trim();
  const source = String(data.source ?? 'cv').slice(0, 20);

  if (!name || !email || !message || name.length > MAX.name || email.length > MAX.email || message.length > MAX.message || !EMAIL_RE.test(email)) {
    return json(422, { ok: false, error: 'validation' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return json(500, { ok: false, error: 'not_configured' });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'kournosenkov.com <contact@kournosenkov.com>',
      to: [process.env.CONTACT_TO || 'ser.corum@gmail.com'],
      reply_to: email,
      subject: `Contact form (${source}): ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSource: ${source}\n\n${message}`,
    }),
  });

  if (!res.ok) return json(502, { ok: false, error: 'send_failed' });
  return json(200, { ok: true });
}

export function GET() {
  return json(405, { ok: false, error: 'method_not_allowed' });
}

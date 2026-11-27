import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TODO: CONNECT AN EMAIL PROVIDER HERE.
  // Right now a signup is only written to the server log (visible in
  // `npm run dev` output and in Vercel > Project > Logs). Nothing is saved.
  //
  // Replace the console.log below with a call to your provider's API, e.g.
  // Kit (ConvertKit), Mailchimp, MailerLite, Flodesk or Beehiiv. Keep the API
  // key in an environment variable (Vercel > Settings > Environment Variables),
  // never in this file. Example shape:
  //
  //   await fetch("https://api.provider.com/subscribers", {
  //     method: "POST",
  //     headers: { Authorization: `Bearer ${process.env.EMAIL_PROVIDER_API_KEY}` },
  //     body: JSON.stringify({ email, tags: [body.placement] }),
  //   });
  // ─────────────────────────────────────────────────────────────────────────
  console.log("[subscribe]", JSON.stringify({
    email,
    placement: body.placement ?? null,
    page: body.page ?? null,
    attribution: body.attribution ?? {},
    ts: new Date().toISOString(),
  }));

  return NextResponse.json({ ok: true });
}

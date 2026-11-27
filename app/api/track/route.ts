import { NextResponse } from "next/server";

// Receives outbound-click events from lib/track.ts and logs them.
// View them in the dev server output or in Vercel > Project > Logs.
// TODO (optional): forward these to an analytics tool or a spreadsheet.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || body.event !== "outbound_click" || typeof body.url !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.slice(0, 500) : null);
  const a = body.attribution ?? {};

  console.log("[outbound_click]", JSON.stringify({
    url: str(body.url),
    label: str(body.label),
    placement: str(body.placement),
    page: str(body.page),
    utm_source: str(a.utm_source),
    utm_medium: str(a.utm_medium),
    utm_campaign: str(a.utm_campaign),
    utm_content: str(a.utm_content),
    utm_term: str(a.utm_term),
    referrer: str(a.referrer),
    landingPage: str(a.landingPage),
    ts: new Date().toISOString(),
  }));

  return new NextResponse(null, { status: 204 });
}

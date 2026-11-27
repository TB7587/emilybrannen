"use client";

// Tiny first-party click tracking. No third-party scripts.
// 1. When someone lands with ?utm_source=... we remember it for the session.
// 2. Every outbound click is sent to /api/track along with those UTMs.

const KEY = "landing_attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  referrer?: string;
  landingPage?: string;
};

/** Call once on page load. First touch wins for the session. */
export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) data[k] = v.slice(0, 100);
    }
    if (document.referrer) data.referrer = document.referrer;
    data.landingPage = window.location.pathname;
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage can be blocked (private mode, in-app browsers). Tracking is optional.
  }
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function trackOutboundClick(detail: { url: string; label: string; placement: string }): void {
  const payload = JSON.stringify({
    event: "outbound_click",
    ...detail,
    page: window.location.pathname,
    attribution: getAttribution(),
    ts: new Date().toISOString(),
  });
  try {
    // sendBeacon survives the page navigating away, which a normal fetch may not.
    const blob = new Blob([payload], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/track", blob)) {
      void fetch("/api/track", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    // Never let tracking block the click.
  }
}

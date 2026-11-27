"use client";

import { useState } from "react";
import { getAttribution } from "@/lib/track";

type Props = {
  heading?: string;
  blurb?: string;
  /** Where the form sits; logged with the signup. */
  placement: string;
};

export function EmailSignup({
  heading = "Get my latest each week",
  blurb = "One email, every week, with my newest projects and recipes. No spam, ever.",
  placement,
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const id = `email-${placement.replace(/\W+/g, "-")}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, placement, page: window.location.pathname, attribution: getAttribution() }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="no-print rounded-md border border-linen bg-oat px-6 py-10 text-center">
      <p className="eyebrow">The weekly letter</p>
      <h2 className="mt-2 text-[2rem]">{heading}</h2>
      <p className="mx-auto mt-2 max-w-md text-ink-soft">{blurb}</p>

      {status === "done" ? (
        <p role="status" className="mx-auto mt-5 max-w-md border border-linen bg-cream px-5 py-4 text-ink">
          You're on the list! Watch your inbox this week.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row">
          <label htmlFor={id} className="sr-only">
            Email address
          </label>
          <input
            id={id}
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-13 w-full flex-1 rounded-[3px] border border-ink/40 bg-white px-5 text-base text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
          />
          <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-70">
            {status === "sending" ? "Signing up…" : "Sign me up"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p role="alert" className="mt-3 text-barn">
          That didn't go through. Please check your email address and try again.
        </p>
      )}
    </section>
  );
}

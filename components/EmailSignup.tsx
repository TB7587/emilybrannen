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
  heading = "Get my recipes each week",
  blurb = "One email, every week, with my newest recipes. No spam, ever.",
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
    <section className="no-print rounded-3xl bg-sage px-6 py-8 text-cream">
      <h2 className="text-[1.7rem] font-semibold">{heading}</h2>
      <p className="mt-2 text-cream/90">{blurb}</p>

      {status === "done" ? (
        <p role="status" className="mt-5 rounded-2xl bg-cream px-5 py-4 font-bold text-cocoa">
          You're on the list! Watch your inbox for this week's recipes.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
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
            className="min-h-13 w-full flex-1 rounded-full border-2 border-transparent bg-cream px-5 text-base text-cocoa placeholder:text-cocoa-soft focus:border-butter focus:outline-none"
          />
          <button type="submit" disabled={status === "sending"} className="btn btn-butter disabled:opacity-70">
            {status === "sending" ? "Signing up…" : "Send me recipes"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p role="alert" className="mt-3 font-bold text-butter">
          That didn't go through. Please check your email address and try again.
        </p>
      )}
    </section>
  );
}

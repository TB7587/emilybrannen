"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/track";

/** Remembers utm_* params from the landing URL for this visit. Renders nothing. */
export function UtmCapture() {
  useEffect(() => captureAttribution(), []);
  return null;
}

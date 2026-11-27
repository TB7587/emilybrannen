"use client";

export function PrintButton({ label = "Print this recipe" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-outline no-print w-full">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6z" />
      </svg>
      {label}
    </button>
  );
}

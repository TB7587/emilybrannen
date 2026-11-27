/** The hairline-heart-hairline divider from the logo. */
export function HeartRule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-4 text-ink ${className}`}>
      <span className="h-px w-full max-w-28 bg-ink/50" />
      <svg width="20" height="18" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.4" className="shrink-0">
        <path d="M12 20.500S2.500 14.600 2.500 7.800A4.800 4.800 0 0112 5.600a4.800 4.800 0 019.500 2.200c0 6.800-9.500 12.700-9.500 12.700z" strokeLinejoin="round" />
      </svg>
      <span className="h-px w-full max-w-28 bg-ink/50" />
    </div>
  );
}

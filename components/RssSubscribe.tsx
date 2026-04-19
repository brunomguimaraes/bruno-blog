import { FEED_PATH } from "@/lib/site";

type Props = {
  className?: string;
  // "chip": compact pill for header rows. "inline": tiny link-style for
  // paragraphs / end-of-post footers where a chip would be too loud.
  variant?: "chip" | "inline";
  label?: string;
};

// Monochrome cyan RSS glyph (not the convention orange). Matches the site's
// single-accent palette. Square aperture makes it legible at 11–12px.
function RssIcon({ size = 11 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20 5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z" />
    </svg>
  );
}

export default function RssSubscribe({
  className = "",
  variant = "chip",
  label = "rss",
}: Props) {
  if (variant === "inline") {
    return (
      <a
        href={FEED_PATH}
        className={`inline-flex items-center gap-1 text-accent transition hover:text-accent-bright hover:[text-shadow:0_0_6px_rgba(79,211,255,0.6)] ${className}`}
        aria-label="Subscribe via RSS"
      >
        <RssIcon size={10} />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <a
      href={FEED_PATH}
      className={`group inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/[0.08] px-2.5 py-1 text-[10.5px] uppercase tracking-[0.18em] text-accent transition hover:border-accent/70 hover:bg-accent/[0.14] hover:text-white hover:shadow-[0_0_14px_rgba(79,211,255,0.3)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 ${className}`}
      aria-label="Subscribe via RSS"
    >
      <RssIcon size={11} />
      <span>{label}</span>
    </a>
  );
}

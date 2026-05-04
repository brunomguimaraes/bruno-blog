"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  src?: string;
  alt?: string;
  title?: string;
};

export default function BlogImage({ src, alt = "", title }: Props) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [zoomed]);

  if (!src) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label={alt ? `Zoom image: ${alt}` : "Zoom image"}
        className="my-8 block w-full cursor-zoom-in border-0 bg-transparent p-0 lg:-mx-16 lg:w-[calc(100%+8rem)] xl:-mx-32 xl:w-[calc(100%+16rem)]"
      >
        {/* width/height={0} + sizes + auto-sized className is the documented
            Next.js pattern for unknown intrinsic dimensions. Yields a full
            srcset so the browser picks a sharp variant on HiDPI displays —
            fixes the "soft / low-quality" look of the plain <img>. */}
        <Image
          src={src}
          alt={alt}
          title={title}
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 672px, (max-width: 1280px) 896px, 1024px"
          quality={90}
          className="h-auto w-full rounded-md border border-accent/15"
        />
      </button>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt || "Image preview"}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-[2000] flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full cursor-default object-contain"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoomed(false);
            }}
            className="absolute right-4 top-4 inline-flex items-center gap-2 rounded border border-accent/40 bg-black/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent hover:bg-accent/10"
          >
            esc <span aria-hidden>×</span>
          </button>
          {alt && (
            <p className="pointer-events-none absolute inset-x-4 bottom-4 mx-auto max-w-2xl text-center font-mono text-xs text-accent-dim">
              {alt}
            </p>
          )}
        </div>
      )}
    </>
  );
}

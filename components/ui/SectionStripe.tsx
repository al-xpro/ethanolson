"use client";

import { useEffect, useId, useRef, useState } from "react";

type Item = { id: string; label: string };

// Small screens: a sticky stripe under the page title shows the current section, and
// opens a dropdown table of contents. The panel never takes more than 75% of the height,
// so it fits phones in landscape too.
export function SectionStripe({
  items,
  current,
  label,
}: {
  items: Item[];
  current: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const currentItem = items.find((item) => item.id === current) ?? items[0];
  const index = items.indexOf(currentItem);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      if (event instanceof PointerEvent && root.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, [open]);

  return (
    <div ref={root} className="sticky top-0 z-100 -mx-5 sm:-mx-10 lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 border-y border-white/15 bg-[#111] py-4 pl-5 pr-24 sm:pl-10 text-left text-white"
      >
        <span className="text-xs tracking-[0.25rem] uppercase text-white/50 tabular-nums">
          {String(index + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1 truncate text-base">
          <span className="sr-only">{label}: </span>
          {currentItem.label}
        </span>
        <span aria-hidden className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      <nav
        id={panelId}
        aria-label={label}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[75svh] overflow-y-auto border-b border-white/15 bg-[#161616] shadow-2xl"
      >
        <ol className="flex flex-col py-2">
          {items.map((item, itemIndex) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={item.id === current ? "location" : undefined}
                onClick={() => setOpen(false)}
                className={`flex gap-4 px-5 sm:px-10 py-3 text-base transition-colors duration-300 ${
                  item.id === current ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                <span className="text-xs leading-6 text-white/40 tabular-nums">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { useSmoothAnchor } from "@/lib/useSmoothAnchor";

type Item = { id: string; label: string };

// Small screens: a slim tab on the left edge, centered in the viewport, with one tick per
// section (the ones on screen are lit). It opens a panel with every heading. It only shows
// while the sections cross the middle of the screen, and stays inside the page gutter.
export function SectionMinimap({
  items,
  active,
  label,
  region,
}: {
  items: Item[];
  active: string[];
  label: string;
  region: RefObject<HTMLElement | null>;
}) {
  const [open, setOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const goTo = useSmoothAnchor();
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = region.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) setOpen(false);
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [region]);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent) {
        if (event.key !== "Escape") return;
        button.current?.focus();
      }
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
    <div
      ref={root}
      inert={!inView}
      className={`fixed left-0 top-1/2 z-150 -translate-y-1/2 transition-[opacity,translate] duration-500 motion-reduce:transition-none lg:hidden ${
        inView ? "opacity-100" : "pointer-events-none -translate-x-full opacity-0"
      }`}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        // 20px wide to fit the gutter; the invisible ::before widens the touch target
        className="relative flex w-5 flex-col items-start gap-2 rounded-r-2xl border border-l-0 border-white/25 bg-[#161616]/90 py-4 pl-1.5 backdrop-blur before:absolute before:-inset-y-2 before:left-0 before:-right-4 transition-colors duration-300 hover:border-white"
      >
        <span className="sr-only">{label}</span>
        {items.map((item) => (
          <span
            key={item.id}
            aria-hidden
            className={`block h-0.5 rounded-full transition-[width,background-color] duration-500 ${
              active.includes(item.id) ? "w-2.5 bg-white" : "w-1.5 bg-white/35"
            }`}
          />
        ))}
      </button>

      <nav
        id={panelId}
        aria-label={label}
        // Lenis would otherwise take the wheel and touch scroll away from the panel
        data-lenis-prevent
        className={`absolute left-full top-1/2 ml-3 max-h-[75svh] w-[min(18rem,calc(100vw-3.5rem))] -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-[#161616] p-5 text-white shadow-2xl transition-[opacity,translate,visibility] duration-300 motion-reduce:transition-none ${
          open ? "visible opacity-100" : "invisible -translate-x-2 opacity-0"
        }`}
      >
        <p className="text-xs tracking-[0.25rem] uppercase text-white/50">{label}</p>
        {/* No gap between entries: their borders touch, so active ones form one line */}
        <ol className="mt-4 flex flex-col border-l border-white/15">
          {items.map((item, index) => {
            const current = active.includes(item.id);
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current ? "location" : undefined}
                  onClick={(event) => {
                    setOpen(false);
                    goTo(event, item.id);
                  }}
                  className={`-ml-px flex gap-3 border-l py-2 pl-4 text-base leading-snug transition-colors duration-300 ${
                    current ? "border-white text-white" : "border-transparent text-white/55 hover:text-white"
                  }`}
                >
                  <span className="text-xs leading-6 text-white/40 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

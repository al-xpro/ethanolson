"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

// Past this far (on the pointer), or this fast, letting go closes the drawer instead of
// springing it back. Short on purpose: nobody wants to drag a tall sheet all the way down.
const DISMISS_DISTANCE = 40;
const DISMISS_VELOCITY = 300; // px per second
// The sheet travels twice as far as the finger, so a short flick sends it away
const DRAG_SPEED = 2;
// Below this, a press is a tap and belongs to whatever is under the finger
const DRAG_THRESHOLD = 8;

// What Tab may reach. Roving grids give one cell tabindex 0 and the rest -1: those are skipped.
const FOCUSABLE = ["a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])", "[tabindex]"]
  .map((selector) => `${selector}:not([tabindex="-1"])`)
  .join(",");

const focusableIn = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((element) => element.offsetParent !== null);

const subscribe = () => () => {};

/**
 * A bottom sheet for small screens: the phone version of a popover. It slides up over a
 * dimmed page, can be dragged down by its handle to close, closes on Escape or a tap
 * outside, keeps focus inside while open, and stops the page behind from scrolling.
 */
export function Drawer({
  open,
  onClose,
  title,
  closeLabel = "Close",
  wide = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel?: string;
  /** On larger screens, a centred sheet instead of a full-width one */
  wide?: boolean;
  children: React.ReactNode;
}) {
  // Portals need the document: render nothing on the server
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const reduceMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  // Stays mounted while the closing animation plays
  const [mounted, setMounted] = useState(open);
  const sheet = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const drag = useRef<{ start: number; last: number; lastTime: number; dragging: boolean } | null>(null);

  // Mount when it opens; the closing animation unmounts it when it ends
  if (open && !mounted) setMounted(true);

  useLayoutEffect(() => {
    if (!mounted || !sheet.current || !backdrop.current) return;
    const duration = reduceMotion ? 0 : 1;
    if (open) {
      gsap.fromTo(sheet.current, { yPercent: 100, y: 0 }, { yPercent: 0, duration: 0.45 * duration, ease: "power3.out" });
      gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.25 * duration });
    } else {
      gsap.to(sheet.current, { yPercent: 100, duration: 0.3 * duration, ease: "power2.in" });
      gsap.to(backdrop.current, { opacity: 0, duration: 0.3 * duration, onComplete: () => setMounted(false) });
    }
  }, [open, mounted, reduceMotion]);

  // The page behind stays still while the drawer is open
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [open, lenis]);

  // Focus moves in (unless something inside already took it) and Tab cycles inside
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const element = sheet.current;
      if (element && !element.contains(document.activeElement)) (focusableIn(element)[0] ?? element).focus();
    }, 60);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !sheet.current) return;
      const items = focusableIn(sheet.current);
      if (!items.length) return;
      event.preventDefault();
      const at = items.indexOf(document.activeElement as HTMLElement);
      const next = at === -1 ? 0 : (at + (event.shiftKey ? -1 : 1) + items.length) % items.length;
      items[next].focus();
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open, onClose]);

  if (!ready || !mounted) return null;

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { start: event.clientY, last: event.clientY, lastTime: performance.now(), dragging: false };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || !sheet.current) return;
    if (!state.dragging) {
      if (event.clientY - state.start < DRAG_THRESHOLD) return;
      state.dragging = true;
      // The deadzone shifts the origin, so the sheet moves on this frame without jumping
      state.start += DRAG_THRESHOLD;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    gsap.set(sheet.current, { y: Math.max(0, (event.clientY - state.start) * DRAG_SPEED) });
    state.last = event.clientY;
    state.lastTime = performance.now();
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    drag.current = null;
    if (!state?.dragging || !sheet.current) return;
    const traveled = event.clientY - (state.start - DRAG_THRESHOLD);
    const elapsed = Math.max(performance.now() - state.lastTime, 1);
    const velocity = ((event.clientY - state.last) / elapsed) * 1000;
    if (traveled > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) onClose();
    else gsap.to(sheet.current, { y: 0, duration: 0.4, ease: "back.out(1.6)" });
  };

  return createPortal(
    <div className="fixed inset-0 z-300">
      <div ref={backdrop} aria-hidden onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`absolute inset-x-0 bottom-0 flex max-h-[85svh] min-w-[320px] flex-col rounded-t-3xl border-t border-white/15 bg-[#161616] text-white shadow-2xl outline-none ${
          wide ? "sm:inset-x-auto sm:left-1/2 sm:w-[min(52rem,calc(100vw-4rem))] sm:-translate-x-1/2 sm:border-x" : ""
        }`}
      >
        {/* The handle and the title bar start a drag; the rest keeps its own taps and scrolling */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="shrink-0 cursor-grab touch-none active:cursor-grabbing"
        >
          <span aria-hidden className="mx-auto mt-3 block h-1 w-10 rounded-full bg-white/25" />
          <div className="flex items-center justify-between gap-4 px-5 pt-3 pb-2">
            <p className="text-xs tracking-[0.25rem] uppercase text-white/50">{title}</p>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-white/25 px-3 py-1 text-xs uppercase tracking-widest text-white/70 hover:border-white hover:text-white"
            >
              {closeLabel}
            </button>
          </div>
        </div>
        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

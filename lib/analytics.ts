"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

/**
 * Sends an event to Umami (#30), when it's loaded. Its script loads after the page, so an
 * event fired early waits for it, a few seconds at most. Nothing happens without Umami
 * (no variables, a blocker, or a domain other than the live one).
 */
export function track(event: string, data?: Record<string, string>) {
  let tries = 0;
  const send = () => {
    if (window.umami) window.umami.track(event, data);
    else if (++tries < 10) window.setTimeout(send, 500);
  };
  send();
}

/** Tracks an event once, when a page opens */
export function TrackView({ event, data }: { event: string; data?: Record<string, string> }) {
  const key = JSON.stringify(data);
  useEffect(() => {
    track(event, key ? JSON.parse(key) : undefined);
  }, [event, key]);
  return null;
}

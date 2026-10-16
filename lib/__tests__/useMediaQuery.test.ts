import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "@/lib/useMediaQuery";

// jsdom has no matchMedia, so each test controls a fake one
function mockMatchMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();

  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      get matches() {
        return matches;
      },
      media: query,
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    }))
  );

  return {
    change(next: boolean) {
      matches = next;
      listeners.forEach((listener) => listener());
    },
    listenerCount: () => listeners.size,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useMediaQuery", () => {
  it("returns the current match", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("updates when the media query changes", () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery("(prefers-reduced-motion: reduce)"));
    expect(result.current).toBe(false);

    act(() => media.change(true));
    expect(result.current).toBe(true);
  });

  it("stops listening on unmount", () => {
    const media = mockMatchMedia(false);
    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(media.listenerCount()).toBe(1);

    unmount();
    expect(media.listenerCount()).toBe(0);
  });
});

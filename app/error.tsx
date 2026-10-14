"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with an error-tracking call once monitoring is set up
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-black px-5 text-center text-white">
      <p className="text-xs md:text-sm font-light tracking-[0.5rem] uppercase">Something broke</p>
      <h1 className="text-5xl sm:text-7xl uppercase">Unexpected error</h1>
      <button
        type="button"
        onClick={reset}
        className="rounded-full border border-white px-8 py-4 text-sm uppercase tracking-widest transition-colors duration-300 hover:bg-white hover:text-black"
      >
        Try again
      </button>
    </main>
  );
}

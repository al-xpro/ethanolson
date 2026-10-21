"use client";

import { useState } from "react";
import type { ContentIssue } from "@/lib/cms/validate";

// Only in the Visual Editor (draft mode): content that breaks a rule is listed here, and the
// page shows the previous version of those fields until it's fixed
export function ContentIssues({ issues, title }: { issues: ContentIssue[]; title?: string }) {
  const [open, setOpen] = useState(true);
  if (!issues.length) return null;
  return (
    <aside
      aria-label="Content to fix"
      className="fixed bottom-4 left-4 z-400 w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-[#ff8a80]/50 bg-[#1b1111] text-sm text-white shadow-2xl"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span>
          {issues.length} {issues.length === 1 ? "field needs" : "fields need"} attention
          {title ? <span className="text-white/50"> · {title}</span> : null}
        </span>
        <span aria-hidden>{open ? "–" : "+"}</span>
      </button>
      {open && (
        <div className="max-h-[50vh] overflow-y-auto border-t border-white/10 px-5 py-4" data-lenis-prevent>
          <ul className="flex flex-col gap-3">
            {issues.map((issue, index) => (
              <li key={index} className="flex flex-col gap-0.5">
                <span className="text-white">{issue.field}</span>
                <span className="text-[#ff8a80]">{issue.message}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-white/50">
            The page keeps showing the previous version of these fields until they follow the rules.
          </p>
        </div>
      )}
    </aside>
  );
}

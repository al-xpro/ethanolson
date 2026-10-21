"use client";

import { usePathname } from "next/navigation";
import { agentView as copy } from "@/content/ui";

// The footer's "View as an agent": the current page as AI agents read it, in llms.txt
// (/llms.txt?page=/about, and /home for the home page)
export function AgentView({ className }: { className: string }) {
  const pathname = usePathname();
  const page = pathname === "/" ? "/home" : pathname;
  return (
    <a href={`/llms.txt?page=${encodeURIComponent(page)}`} target="_blank" rel="noopener" className={className}>
      {copy.button}
    </a>
  );
}

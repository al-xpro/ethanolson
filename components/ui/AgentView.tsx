"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { agentView as copy } from "@/content/ui";
import { markdownPath } from "@/lib/markdown-path";

type State = { status: "idle" | "loading" | "missing" } | { status: "ready"; text: string };

// The footer's "View as an agent": opens the current page's Markdown version, the same
// text AI agents get from /llms.txt and the .md links
export function AgentView({ className }: { className: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>({ status: "idle" });
  const [copied, setCopied] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const href = markdownPath(pathname);

  const show = async () => {
    setOpen(true);
    setCopied(false);
    setState({ status: "loading" });
    try {
      const response = await fetch(href);
      setState(response.ok ? { status: "ready", text: await response.text() } : { status: "missing" });
    } catch {
      setState({ status: "missing" });
    }
  };

  const close = () => {
    setOpen(false);
    button.current?.focus();
  };

  const copyText = async () => {
    if (state.status !== "ready") return;
    await navigator.clipboard.writeText(state.text);
    setCopied(true);
  };

  const action =
    "cursor-pointer rounded-full border border-white/25 px-3 py-1 text-xs uppercase tracking-widest text-white/70 transition-colors duration-300 hover:border-white hover:text-white";

  return (
    <>
      <button ref={button} type="button" onClick={show} aria-haspopup="dialog" className={className}>
        {copy.button}
      </button>
      <Drawer open={open} onClose={close} title={copy.title} closeLabel={copy.close} wide>
        <div className="flex flex-wrap items-center gap-2 pb-4">
          <code className="mr-auto text-xs text-white/50">{href}</code>
          {state.status === "ready" && (
            <button type="button" onClick={copyText} className={action}>
              <span aria-live="polite">{copied ? copy.copied : copy.copy}</span>
            </button>
          )}
          {state.status === "ready" && (
            <a href={href} target="_blank" rel="noopener" className={action}>
              {copy.raw}
            </a>
          )}
          <a href="/llms.txt" target="_blank" rel="noopener" className={action}>
            {copy.index}
          </a>
        </div>
        {state.status === "ready" ? (
          <pre className="whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed text-white/80">
            {state.text}
          </pre>
        ) : (
          <p className="py-6 text-sm text-white/60">{state.status === "missing" ? copy.missing : copy.loading}</p>
        )}
      </Drawer>
    </>
  );
}

// Minimal UI templates for each project, built in code instead of screenshots

type Template = { title: string; body: React.ReactNode };

const Bar = ({ w, strong = false }: { w: string; strong?: boolean }) => (
  <span className={`block h-2 xl:h-[0.55vw] rounded-full ${strong ? "bg-white/85" : "bg-white/20"}`} style={{ width: w }} />
);
const Row = ({ children, active = false }: { children: React.ReactNode; active?: boolean }) => (
  <div
    className={`flex items-center justify-between gap-3 rounded-lg xl:rounded-[0.6vw] border px-3 py-2.5 xl:px-[0.9vw] xl:py-[0.7vw] text-xs xl:text-[0.85vw] ${
      active ? "border-white bg-white text-black" : "border-white/15 text-white/75"
    }`}
  >
    {children}
  </div>
);
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-white/25 px-2.5 py-1 text-[10px] xl:text-[0.7vw] text-white/70">{children}</span>
);

const templates: Record<string, Template[]> = {
  quarrow: [
    {
      title: "Live map",
      body: (
        <svg viewBox="0 0 200 150" className="w-full" aria-hidden>
          <path d="M10 130 L60 80 L95 95 L140 40 L190 20" stroke="#fff" strokeWidth="3" fill="none" />
          <path d="M15 30 L70 40 L110 120 L180 110" stroke="rgb(255 255 255 / 0.35)" strokeWidth="2" strokeDasharray="6 5" fill="none" />
          {[[10, 130], [95, 95], [190, 20], [70, 40], [180, 110]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="#111" stroke="#fff" strokeWidth="2.5" />
          ))}
        </svg>
      ),
    },
    {
      title: "Dispatch",
      body: (
        <div className="flex flex-col gap-2">
          <Row active>
            <span>Route 14</span>
            <span>On time</span>
          </Row>
          <Row>
            <span>Route 09</span>
            <span>+12 min</span>
          </Row>
          <Row>
            <span>Route 22</span>
            <span>Loading</span>
          </Row>
          <Row>
            <span>Route 03</span>
            <span>Delivered</span>
          </Row>
        </div>
      ),
    },
    {
      title: "Delay alert",
      body: (
        <div className="flex flex-col gap-3 rounded-xl border border-white/30 p-4 xl:p-[1vw]">
          <span className="text-sm xl:text-[1vw]">Route 09 is running 12 minutes late</span>
          <Bar w="80%" />
          <div className="flex gap-2">
            <Chip>Reroute</Chip>
            <Chip>Notify client</Chip>
          </div>
        </div>
      ),
    },
  ],
  "mirelle-health": [
    {
      title: "Choose a service",
      body: (
        <div className="flex flex-col gap-2">
          <Row active>
            <span>General check-up</span>
            <span>→</span>
          </Row>
          <Row>
            <span>Physiotherapy</span>
            <span>→</span>
          </Row>
          <Row>
            <span>Dermatology</span>
            <span>→</span>
          </Row>
        </div>
      ),
    },
    {
      title: "Pick a time",
      body: (
        <div className="grid grid-cols-4 gap-1.5">
          {["9:00", "9:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"].map((time, index) => (
            <span
              key={time}
              className={`rounded-md border py-2 text-center text-[10px] xl:text-[0.75vw] ${
                index === 5 ? "border-white bg-white text-black" : "border-white/15 text-white/60"
              }`}
            >
              {time}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Confirmed",
      body: (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/30 p-5 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">✓</span>
          <span className="text-sm xl:text-[1vw]">Thursday, 14:00</span>
          <Bar w="60%" />
        </div>
      ),
    },
  ],
  "tenebre-audio": [
    {
      title: "Viewer",
      body: (
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 120 90" className="w-2/3" aria-hidden>
            <path d="M25 70 C25 15 95 15 95 70" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" />
            <rect x="15" y="58" width="20" height="28" rx="8" fill="#fff" />
            <rect x="85" y="58" width="20" height="28" rx="8" fill="#fff" />
          </svg>
          <span className="text-[10px] xl:text-[0.75vw] tracking-[0.2rem] uppercase text-white/50">Drag to turn</span>
        </div>
      ),
    },
    {
      title: "Finish",
      body: (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {["#5c5c5c", "#363636", "#c4c4c4", "#141414"].map((tone, index) => (
              <span
                key={tone}
                className={`h-8 w-8 xl:h-[2.2vw] xl:w-[2.2vw] rounded-full border ${index === 2 ? "border-white ring-2 ring-white/40 ring-offset-2 ring-offset-[#161616]" : "border-white/20"}`}
                style={{ background: tone }}
              />
            ))}
          </div>
          <span className="text-sm xl:text-[1vw]">Brushed steel</span>
          <Bar w="45%" />
        </div>
      ),
    },
    {
      title: "Cart",
      body: (
        <div className="flex flex-col gap-2">
          <Row>
            <span>Model T1, steel</span>
            <span>€420</span>
          </Row>
          <Row>
            <span>Braided cable</span>
            <span>€35</span>
          </Row>
          <Row active>
            <span>Checkout</span>
            <span>€455</span>
          </Row>
        </div>
      ),
    },
  ],
  fieldbook: [
    {
      title: "Story blocks",
      body: (
        <div className="grid grid-cols-2 gap-1.5">
          {["Map", "Timeline", "Quote", "Gallery"].map((block, index) => (
            <span
              key={block}
              className={`rounded-md border px-2 py-3 text-[10px] xl:text-[0.75vw] ${
                index === 1 ? "border-white bg-white text-black" : "border-white/15 text-white/70"
              }`}
            >
              {block}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Article",
      body: (
        <div className="flex flex-col gap-2">
          <span className="text-base xl:text-[1.3vw] leading-tight">The river that moved</span>
          <Bar w="90%" />
          <Bar w="100%" />
          <Bar w="70%" />
          <div className="mt-1 h-12 xl:h-[3.5vw] rounded-md bg-white/10" />
        </div>
      ),
    },
    {
      title: "Newsletter",
      body: (
        <div className="flex flex-col gap-3">
          <span className="text-sm xl:text-[1vw]">New stories, every Sunday</span>
          <span className="border-b border-white/40 pb-1.5 text-[10px] xl:text-[0.75vw] text-white/40">you@example.com</span>
          <span className="self-start rounded-full bg-white px-3 py-1 text-[10px] xl:text-[0.7vw] uppercase tracking-widest text-black">
            Subscribe
          </span>
        </div>
      ),
    },
  ],
  "ardent-ledger": [
    {
      title: "Connect",
      body: (
        <div className="flex flex-col gap-2">
          <Row active>
            <span>1. Connect a bank</span>
            <span>✓</span>
          </Row>
          <Row>
            <span>2. See the forecast</span>
            <span>→</span>
          </Row>
          <Row>
            <span>3. Verify later</span>
            <span />
          </Row>
        </div>
      ),
    },
    {
      title: "Forecast",
      body: (
        <svg viewBox="0 0 200 120" className="w-full" aria-hidden>
          {[20, 45, 30, 60, 50, 75, 65, 90].map((height, index) => (
            <rect key={index} x={8 + index * 24} y={120 - height} width="14" height={height} rx="3" fill="rgb(255 255 255 / 0.12)" />
          ))}
          <polyline points="15,95 39,80 63,88 87,60 111,66 135,42 159,48 183,22" stroke="#fff" strokeWidth="3" fill="none" />
        </svg>
      ),
    },
    {
      title: "Insight",
      body: (
        <div className="flex flex-col gap-3 rounded-xl border border-white/30 p-4 xl:p-[1vw]">
          <span className="text-2xl xl:text-[2vw] leading-none">+18%</span>
          <span className="text-xs xl:text-[0.85vw] text-white/65">More cash at the end of the quarter than last year.</span>
          <Bar w="70%" />
        </div>
      ),
    },
  ],
};

export function ProjectTemplates({ slug }: { slug: string }) {
  return (
    <>
      {(templates[slug] ?? []).map((template) => (
        <div
          key={template.title}
          className="work-template flex flex-col gap-5 xl:gap-[1.2vw] rounded-2xl sm:rounded-3xl xl:rounded-[2vw] border border-white/15 bg-[#161616] p-5 sm:p-7 xl:p-[1.8vw] text-white"
        >
          <span className="text-[10px] sm:text-xs xl:text-[0.75vw] tracking-[0.25rem] uppercase text-white/45">
            {template.title}
          </span>
          {template.body}
        </div>
      ))}
    </>
  );
}

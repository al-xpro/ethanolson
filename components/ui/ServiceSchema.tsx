import type { ServiceStep } from "@/lib/cms/model";

type Service = Pick<ServiceStep, "schema">;

// Diagrams built in code, one per service. Classes used by the page's animations:
// .schema-pop (rises in), .schema-bar (grows from the left), .schema-draw (SVG line draws)

const box = "rounded-xl xl:rounded-[0.9vw] border border-white/20 bg-white/[0.03]";
const caption = "text-[10px] sm:text-xs xl:text-[0.75vw] tracking-[0.2rem] uppercase text-white/45";
// Points down while the diagram is stacked (phones), right once it sits in a row
const arrow = (
  <span aria-hidden className="schema-pop self-center justify-self-center rotate-90 sm:rotate-0 text-white/40 text-lg xl:text-[1.4vw]">
    →
  </span>
);

function SystemSchema() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-3 sm:gap-5 xl:gap-[1.2vw]">
      <div className={`schema-pop ${box} flex flex-col gap-3 p-3 sm:p-5 xl:p-[1.2vw]`}>
        <span className={caption}>Tokens</span>
        <div className="flex flex-wrap gap-1.5">
          {["#ffffff", "#bbbbbb", "#777777", "#333333", "#111111"].map((color) => (
            <span
              key={color}
              className="h-5 w-5 sm:h-7 sm:w-7 xl:h-[1.8vw] xl:w-[1.8vw] rounded-full border border-white/30"
              style={{ background: color }}
            />
          ))}
        </div>
        <div className="flex items-baseline gap-2 leading-none">
          <span className="text-2xl sm:text-4xl xl:text-[2.6vw]">Aa</span>
          <span className="text-lg sm:text-2xl xl:text-[1.7vw] text-white/70">Aa</span>
          <span className="text-sm sm:text-base xl:text-[1.1vw] text-white/50">Aa</span>
        </div>
      </div>
      {arrow}
      <div className={`schema-pop ${box} flex flex-col gap-3 p-3 sm:p-5 xl:p-[1.2vw]`}>
        <span className={caption}>Components</span>
        <span className="self-start rounded-full bg-white px-3 py-1 text-[10px] sm:text-xs xl:text-[0.75vw] uppercase tracking-widest text-black">
          Button
        </span>
        <span className="border-b border-white/40 pb-1 text-[10px] sm:text-xs xl:text-[0.75vw] text-white/50">Input</span>
        <span className="h-6 sm:h-8 xl:h-[2.2vw] rounded-md border border-white/25" />
      </div>
      {arrow}
      <div className={`schema-pop ${box} flex flex-col gap-2 p-3 sm:p-5 xl:p-[1.2vw]`}>
        <span className={caption}>Screens</span>
        <span className="schema-bar h-2 xl:h-[0.6vw] w-3/4 origin-left rounded-full bg-white/80" />
        <span className="schema-bar h-1.5 xl:h-[0.4vw] w-full origin-left rounded-full bg-white/25" />
        <span className="schema-bar h-1.5 xl:h-[0.4vw] w-2/3 origin-left rounded-full bg-white/25" />
        <span className="mt-auto grid grid-cols-2 gap-1.5">
          <span className="h-6 sm:h-10 xl:h-[2.6vw] rounded-md bg-white/10" />
          <span className="h-6 sm:h-10 xl:h-[2.6vw] rounded-md bg-white/10" />
        </span>
      </div>
    </div>
  );
}

function MotionSchema() {
  return (
    <div className={`${box} flex flex-col gap-4 p-4 sm:p-6 xl:p-[1.5vw]`}>
      <div className="flex justify-between">
        <span className={caption}>Easing · cubic-bezier(0.22, 1, 0.36, 1)</span>
        <span className={caption}>0.8 s</span>
      </div>
      <svg viewBox="0 0 400 180" className="w-full overflow-visible" aria-hidden>
        <path d="M0 180 H400 M0 0 V180" stroke="rgb(255 255 255 / 0.2)" fill="none" />
        {[0.25, 0.5, 0.75].map((x) => (
          <path key={x} d={`M${x * 400} 0 V180`} stroke="rgb(255 255 255 / 0.06)" />
        ))}
        <path
          className="schema-draw"
          d="M0 180 C88 0 144 0 400 0"
          stroke="#fff"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {[
          [0, 180],
          [140, 22],
          [400, 0],
        ].map(([cx, cy]) => (
          <circle key={cx} className="schema-pop" cx={cx} cy={cy} r="7" fill="#111" stroke="#fff" strokeWidth="3" />
        ))}
      </svg>
      <div className="flex flex-wrap items-center gap-2">
        <span className="schema-pop rounded-full border border-white/25 px-3 py-1 text-[10px] sm:text-xs xl:text-[0.75vw] text-white/70">
          scroll 0 → 1
        </span>
        <span className="schema-pop rounded-full border border-white/25 px-3 py-1 text-[10px] sm:text-xs xl:text-[0.75vw] text-white/70">
          reduced motion: static
        </span>
      </div>
    </div>
  );
}

function ArchitectureSchema() {
  const node = (title: string, detail: string, strong = false) => (
    <div
      className={`schema-pop flex flex-col gap-1 rounded-xl xl:rounded-[0.9vw] border p-3 sm:p-4 xl:p-[1vw] ${
        strong ? "border-white bg-white text-black" : "border-white/20 bg-white/[0.03]"
      }`}
    >
      <span className="text-xs sm:text-sm xl:text-[1vw]">{title}</span>
      <span className={`text-[10px] sm:text-xs xl:text-[0.75vw] ${strong ? "text-black/60" : "text-white/45"}`}>
        {detail}
      </span>
    </div>
  );
  return (
    <div className="flex flex-col gap-4 xl:gap-[1vw]">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4">
        {node("Form", "client")}
        {arrow}
        {node("Server action", "typed", true)}
        {arrow}
        {node("Validation", "Zod schema")}
      </div>
      <div className="mx-[16%] h-6 sm:h-8 border-x border-t border-white/25 rounded-t-lg hidden sm:block" aria-hidden />
      <span aria-hidden className="justify-self-center rotate-90 text-white/40 text-lg sm:hidden">→</span>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {node("Database", "PostgreSQL")}
        {node("Content", "Headless CMS")}
        {node("E-mail", "Transactional")}
      </div>
    </div>
  );
}

function VitalsSchema() {
  const metrics = [
    { name: "LCP", value: "1.8 s", fill: "w-[72%]" },
    { name: "INP", value: "120 ms", fill: "w-[60%]" },
    { name: "CLS", value: "0.02", fill: "w-[80%]" },
  ];
  return (
    <div className={`${box} grid grid-cols-[1fr_auto] items-center gap-6 sm:gap-10 p-4 sm:p-6 xl:p-[1.5vw]`}>
      <div className="flex flex-col gap-4 xl:gap-[1vw]">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs sm:text-sm xl:text-[0.95vw]">
              <span>{metric.name}</span>
              <span className="text-white/60 tabular-nums">{metric.value} · Good</span>
            </div>
            <div className="h-1.5 xl:h-[0.4vw] w-full rounded-full bg-white/10">
              <div className={`schema-bar h-full ${metric.fill} origin-left rounded-full bg-white`} />
            </div>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 120 120" className="w-20 sm:w-28 xl:w-[8vw]" aria-hidden>
        <circle cx="60" cy="60" r="50" stroke="rgb(255 255 255 / 0.15)" strokeWidth="8" fill="none" />
        <circle
          className="schema-draw"
          cx="60"
          cy="60"
          r="50"
          stroke="#fff"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="68" textAnchor="middle" fill="#fff" fontSize="26" fontFamily="inherit">
          100
        </text>
      </svg>
    </div>
  );
}

export function ServiceSchema({ kind }: { kind: Service["schema"] }) {
  return (
    <figure aria-hidden className="service-schema">
      {kind === "system" && <SystemSchema />}
      {kind === "motion" && <MotionSchema />}
      {kind === "architecture" && <ArchitectureSchema />}
      {kind === "vitals" && <VitalsSchema />}
    </figure>
  );
}

import type { Feature } from "@/lib/cms/model";
import { editable } from "@/lib/cms/editable";

// Classes used by the page's animations: .feature-item (rises in), .feature-strike (line
// draws across), .feature-dot (shrinks away)

const cell = "rounded-2xl xl:rounded-[1.2vw] border border-white/15 bg-[#161616]";

export function WorkFeature({ feature }: { feature: Feature }) {
  return (
    <div {...editable(feature)} className="flex flex-col gap-10 xl:gap-[2.5vw]">
      <h2 className="text-4xl sm:text-6xl xl:text-[4.5vw] uppercase leading-none">{feature.title}</h2>

      {feature.component === "feature_compare" && (
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center xl:gap-[2vw]">
          <ul className="flex flex-col gap-3">
            {feature.before.map((tool, index) => (
              <li key={index} className={`feature-item ${cell} px-6 py-4 xl:px-[1.5vw] xl:py-[1vw] text-white/50 xl:text-[1.2vw]`}>
                <span className="relative">
                  {tool}
                  <span aria-hidden className="feature-strike absolute inset-x-0 top-1/2 h-px origin-left bg-white/70" />
                </span>
              </li>
            ))}
          </ul>
          <span aria-hidden className="feature-item text-center text-3xl xl:text-[2.5vw] text-white/40 rotate-90 md:rotate-0">
            →
          </span>
          <p className="feature-item flex min-h-40 items-center justify-center rounded-2xl xl:rounded-[1.2vw] bg-white px-6 py-10 text-center text-2xl xl:text-[2.4vw] uppercase leading-none text-black">
            {feature.after}
          </p>
        </div>
      )}

      {feature.component === "feature_collapse" && (
        <div className="flex flex-col gap-8 xl:gap-[2vw]">
          <div className="flex flex-wrap gap-2 xl:gap-[0.6vw]" aria-label={`${feature.from} steps before`}>
            {Array.from({ length: feature.from }, (_, index) => (
              <span
                key={index}
                className="feature-dot flex h-10 w-10 xl:h-[2.8vw] xl:w-[2.8vw] items-center justify-center rounded-full border border-white/25 text-xs xl:text-[0.8vw] text-white/40 tabular-nums"
              >
                {index + 1}
              </span>
            ))}
          </div>
          <ol className="grid gap-3 sm:grid-cols-3 xl:gap-[1.5vw]">
            {feature.steps.map((step, index) => (
              <li key={index} className={`feature-item ${cell} flex flex-col gap-6 p-6 xl:p-[1.8vw]`}>
                <span className="flex h-12 w-12 xl:h-[3.2vw] xl:w-[3.2vw] items-center justify-center rounded-full bg-white text-black xl:text-[1.1vw]">
                  {index + 1}
                </span>
                <span className="text-xl xl:text-[1.6vw] leading-tight">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {feature.component === "feature_swatches" && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5 xl:gap-[1.2vw]">
          {feature.swatches.map((swatch, index) => (
            <li key={index} {...editable(swatch)} className="feature-item flex flex-col gap-3">
              <span
                className="aspect-square rounded-full border border-white/20 shadow-[inset_0_-12px_24px_rgb(0_0_0/0.45),inset_0_10px_20px_rgb(255_255_255/0.15)]"
                style={{ background: swatch.tone }}
              />
              <span className="text-center text-sm xl:text-[1vw] text-white/70">{swatch.name}</span>
            </li>
          ))}
        </ul>
      )}

      {feature.component === "feature_blocks" && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:gap-[1.2vw]">
          {feature.blocks.map((block, index) => (
            <li
              key={index}
              className={`feature-item ${cell} flex aspect-[4/3] flex-col justify-between p-5 xl:p-[1.4vw] ${
                index % 3 === 0 ? "bg-white text-black" : ""
              }`}
            >
              <span className={`text-xs xl:text-[0.8vw] tabular-nums ${index % 3 === 0 ? "text-black/50" : "text-white/40"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-lg xl:text-[1.5vw] leading-tight">{block}</span>
            </li>
          ))}
        </ul>
      )}

      {feature.component === "feature_sequence" && (
        <ol className="relative grid gap-6 sm:grid-cols-3 xl:gap-[2vw]">
          <span aria-hidden className="feature-strike absolute left-0 right-0 top-6 xl:top-[1.6vw] hidden h-px origin-left bg-white/40 sm:block" />
          {feature.steps.map((step, index) => (
            <li key={index} {...editable(step)} className="feature-item relative flex flex-col gap-4">
              <span
                className={`flex h-12 w-12 xl:h-[3.2vw] xl:w-[3.2vw] items-center justify-center rounded-full border xl:text-[1.1vw] ${
                  index < 2 ? "border-white bg-white text-black" : "border-white/40 bg-[#111] text-white/60"
                }`}
              >
                {index + 1}
              </span>
              <span className="text-xs xl:text-[0.8vw] tracking-[0.25rem] uppercase text-white/50">{step.time}</span>
              <span className="text-xl xl:text-[1.7vw] leading-tight">{step.label}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

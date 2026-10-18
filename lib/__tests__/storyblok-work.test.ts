import { describe, expect, it } from "vitest";
import { works } from "@/content/works";
import { toWork, type WorkBlok } from "@/lib/storyblok/work";

const base = works[0];
const blok: WorkBlok = {
  _uid: "1",
  component: "work",
  title: "Quarrow, edited",
  year: "2025",
  stack: "Next.js\n  TypeScript \n\n",
  summary: "A new summary.",
  solution: [{ _uid: "2", component: "solution_step", text: "One step." }],
  results: [{ _uid: "3", component: "result", value: "12.5", prefix: "", suffix: "%", label: "Faster" }],
};

describe("toWork", () => {
  it("maps Storyblok fields onto the project", () => {
    const work = toWork(blok, base);
    expect(work.title).toBe("Quarrow, edited");
    expect(work.year).toBe(2025);
    expect(work.stack).toEqual(["Next.js", "TypeScript"]);
    expect(work.solution).toEqual(["One step."]);
    expect(work.results).toEqual([{ value: 12.5, prefix: undefined, suffix: "%", label: "Faster" }]);
  });

  it("keeps the project's own values for fields Storyblok doesn't have", () => {
    const work = toWork(blok, base);
    expect(work.slug).toBe(base.slug);
    expect(work.feature).toBe(base.feature);
    expect(work.client).toBe(base.client);
    expect(toWork({ ...blok, year: "" }, base).year).toBe(base.year);
  });
});

import { describe, expect, it } from "vitest";
import { work } from "@/lib/cms/model";
import { validate } from "@/lib/cms/validate";
import { defaultWorks } from "@/content/defaults/works";

const [quarrow] = defaultWorks;

describe("validate", () => {
  it("keeps content that follows the rules", () => {
    const result = validate(work, quarrow, quarrow);
    expect(result.issues).toEqual([]);
    expect(result.value?.title).toBe("Quarrow");
  });

  it("falls back field by field, and says what was wrong in the client's words", () => {
    const edited = { ...quarrow, title: "Q", summary: "A new summary that is long enough to pass the rule of forty." };
    const result = validate(work, edited, quarrow);
    expect(result.value?.title).toBe("Quarrow");
    expect(result.value?.summary).toBe(edited.summary);
    expect(result.issues).toEqual([{ field: "Title", message: "At least 2 characters" }]);
  });

  it("rejects media over their weight limit", () => {
    const heavy = { ...quarrow, cover: { ...quarrow.cover, bytes: 900 * 1024 } };
    const result = validate(work, heavy, quarrow);
    expect(result.value?.cover).toEqual(quarrow.cover);
    expect(result.issues[0]).toEqual({ field: "Cover", message: "Up to 500 KB: this file is 900 KB" });
  });

  it("labels nested fields like Storyblok does", () => {
    const edited = { ...quarrow, results: quarrow.results.map((result, index) => (index === 1 ? { ...result, label: "x" } : result)) };
    expect(validate(work, edited, quarrow).issues[0].field).toBe("Results › 2 › Label");
  });

  it("returns nothing usable for a broken new work without defaults", () => {
    const result = validate(work, { ...quarrow, cover: undefined, title: "" });
    expect(result.value).toBeNull();
    expect(result.issues.length).toBeGreaterThan(0);
  });
});

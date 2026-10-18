import { describe, expect, it } from "vitest";
import { monthAvailability } from "@/lib/availability";

const open = (days: ReturnType<typeof monthAvailability>) =>
  days.filter((day) => day.slots.length).map((day) => day.day);

describe("monthAvailability", () => {
  it("covers every day of the month", () => {
    expect(monthAvailability(2026, 1, new Date(2026, 0, 1))).toHaveLength(28);
    expect(monthAvailability(2026, 9, new Date(2026, 0, 1))).toHaveLength(31);
  });

  it("gives the same days for the same month", () => {
    const today = new Date(2026, 9, 1);
    expect(open(monthAvailability(2026, 9, today))).toEqual(open(monthAvailability(2026, 9, today)));
  });

  it("changes from one month to the next", () => {
    const today = new Date(2026, 0, 1);
    expect(open(monthAvailability(2026, 9, today))).not.toEqual(open(monthAvailability(2026, 10, today)));
  });

  it("is never open on weekends or past days", () => {
    const days = monthAvailability(2026, 9, new Date(2026, 9, 18));
    for (const day of days) {
      if (day.weekday > 4 || day.past) expect(day.slots).toEqual([]);
    }
    expect(days.find((day) => day.today)?.day).toBe(18);
  });

  it("keeps a day's windows as the month goes by", () => {
    const early = monthAvailability(2026, 9, new Date(2026, 9, 1));
    const later = monthAvailability(2026, 9, new Date(2026, 9, 20));
    expect(later[25].slots).toEqual(early[25].slots);
  });

  it("opens most months on a reasonable number of weekdays", () => {
    const counts = Array.from({ length: 12 }, (_, month) => open(monthAvailability(2027, month, new Date(2026, 0, 1))).length);
    for (const count of counts) expect(count).toBeGreaterThanOrEqual(5);
  });
});

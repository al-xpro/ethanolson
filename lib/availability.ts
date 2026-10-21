// Ethan's availability is part of the concept: a believable pattern that changes every
// month, computed from the month itself, so it needs no calendar service, cron or database.

export type Day = {
  date: Date;
  /** Day of the month, 1–31 */
  day: number;
  /** Monday-based weekday, 0–6 */
  weekday: number;
  past: boolean;
  today: boolean;
  /** Call windows on the day; empty when it's past, a weekend or fully booked */
  slots: string[];
};

// Two-hour windows in the morning and the afternoon (Central European Time)
const WINDOWS = ["09:00–10:30", "10:30–12:00", "14:00–15:30", "15:30–17:00"];

// Small seeded generator (mulberry32): the same month always gives the same days
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Every day of the month (0-based `month`), with the windows Ethan can be reached in (from tomorrow) */
export function monthAvailability(year: number, month: number, today: Date): Day[] {
  const next = random(year * 12 + month + 1);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const length = new Date(year, month + 1, 0).getDate();

  return Array.from({ length }, (_, index) => {
    const date = new Date(year, month, index + 1);
    const weekday = (date.getDay() + 6) % 7;
    const past = date < start;
    // Draw for every day, so a day's windows don't change as the month goes by
    const open = next() < 0.55;
    const picks = WINDOWS.filter(() => next() < 0.45);
    const slots = picks.length ? picks : [WINDOWS[Math.floor(next() * WINDOWS.length)]];
    return {
      date,
      day: index + 1,
      weekday,
      past,
      today: date.getTime() === start.getTime(),
      // Calls are booked from tomorrow: today's windows may already be over
      slots: !past && date > start && weekday < 5 && open ? slots : [],
    };
  });
}

/** "2026-10-21 14:00–15:30": the value the form sends for a chosen call */
export const slotValue = (date: Date, slot: string) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${slot}`;

/** Whether a sent call slot is really free: this month or the next, not in the past */
export function isOpenSlot(value: string, today: Date = new Date()) {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2}–\d{2}:\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day, slot] = match;
  const offset = (Number(year) - today.getFullYear()) * 12 + Number(month) - 1 - today.getMonth();
  if (offset < 0 || offset > 1) return false;
  const days = monthAvailability(Number(year), Number(month) - 1, today);
  return days[Number(day) - 1]?.slots.includes(slot) ?? false;
}

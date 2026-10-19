"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { contactPage } from "@/content/sections";
import { monthAvailability, slotValue } from "@/lib/availability";

const copy = contactPage.callPicker;
const monthName = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });

// Today only exists in the browser (the page is static): the picker opens after hydration
const subscribe = () => () => {};
const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
};

// "2026-10-21 14:00–15:30" → "Wednesday 21 October, 14:00–15:30"
function describe(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (.+)$/.exec(value);
  if (!match) return "";
  const [, year, month, day, slot] = match;
  return `${longDate.format(new Date(Number(year), Number(month) - 1, Number(day)))}, ${slot}`;
}

// A date picker for the free call slots (WAI-ARIA date picker dialog pattern): the button
// opens a month grid of this month and the next, where arrow keys move between days, a free
// day shows its times, and a time fills the hidden field sent with the form.
export function CallPicker({
  name,
  defaultValue = "",
  error,
  labelClass,
  fieldClass,
  onChange,
}: {
  name: string;
  defaultValue?: string;
  error?: string;
  labelClass: string;
  fieldClass: string;
  onChange?: () => void;
}) {
  const key = useSyncExternalStore(subscribe, todayKey, () => null);
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [focused, setFocused] = useState(1);
  const [picked, setPicked] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const grid = useRef<HTMLTableElement>(null);
  const times = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);
  const id = useId();

  const [year, month, date] = (key ?? "0-0-1").split("-").map(Number);
  const today = new Date(year, month, date);
  const first = new Date(year, month + offset, 1);
  const days = key ? monthAvailability(first.getFullYear(), first.getMonth(), today) : [];
  const free = days.filter((day) => day.slots.length);
  const pickedDay = days.find((day) => day.day === picked && day.slots.length);

  // The form re-validates when the hidden value changes (not on the first render)
  const notify = useRef(onChange);
  useEffect(() => {
    notify.current = onChange;
  }, [onChange]);
  const changed = useRef(false);
  useEffect(() => {
    if (changed.current) notify.current?.();
    changed.current = true;
  }, [value]);

  // Arrow keys move the roving focus; the matching button takes it after rendering
  useEffect(() => {
    if (!open || !moveFocus.current) return;
    moveFocus.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focused}"]`)?.focus();
  }, [open, focused, offset]);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const show = (nextOffset: number, day: number) => {
    const length = new Date(year, month + nextOffset + 1, 0).getDate();
    setOffset(nextOffset);
    setFocused(Math.min(Math.max(day, 1), length));
    moveFocus.current = true;
  };

  const openPicker = () => {
    // Start on the chosen day, or the first free one
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    const chosen = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
    const chosenOffset = chosen ? (chosen.getFullYear() - year) * 12 + chosen.getMonth() - month : 0;
    if (chosen && chosenOffset >= 0 && chosenOffset <= 1) {
      setPicked(chosen.getDate());
      show(chosenOffset, chosen.getDate());
    } else {
      const firstFree = monthAvailability(year, month, today).find((day) => day.slots.length);
      setPicked(null);
      show(0, firstFree?.day ?? date);
    }
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  const onGridKey = (event: React.KeyboardEvent) => {
    const length = days.length;
    const weekday = days[focused - 1]?.weekday ?? 0;
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -weekday,
      End: 6 - weekday,
    };
    if (event.key in moves) {
      event.preventDefault();
      const target = focused + moves[event.key];
      if (target < 1 && offset === 1) show(0, new Date(year, month + 1, 0).getDate() + target);
      else if (target > length && offset === 0) show(1, target - length);
      else show(offset, target);
    } else if (event.key === "PageDown" || event.key === "PageUp") {
      event.preventDefault();
      show(event.key === "PageDown" ? 1 : 0, focused);
    }
  };

  const pickDay = (day: number) => {
    setPicked(day);
    setFocused(day);
    requestAnimationFrame(() => times.current?.querySelector("button")?.focus());
  };

  const pickTime = (slot: string) => {
    if (!pickedDay) return;
    setValue(slotValue(pickedDay.date, slot));
    close();
  };

  const lead = days[0]?.weekday ?? 0;
  const cells = [...Array<null>(lead).fill(null), ...days];
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, row) => cells.slice(row * 7, row * 7 + 7));
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.preventDefault();
          close();
        }
      }}
    >
      <span id={`${id}-label`} className={labelClass}>
        {copy.label} <span className="normal-case tracking-normal text-white/40">({copy.optional})</span>
      </span>
      <input type="hidden" name={name} value={value} />
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-describedby={describedBy}
        disabled={!key}
        onClick={() => (open ? setOpen(false) : openPicker())}
        // aria-invalid isn't allowed on a button: the error is linked with aria-describedby
        className={`${fieldClass} flex cursor-pointer items-center justify-between gap-4 text-left disabled:cursor-default ${
          error ? "border-[#ff8a80]" : ""
        }`}
      >
        <span id={`${id}-value`} className={value ? "" : "text-white/40"}>
          {value ? describe(value) : copy.placeholder}
        </span>
        <span aria-hidden className={`text-base transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm xl:text-[0.9vw] text-[#ff8a80]">
          {error}
        </p>
      )}

      {open && key && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={copy.dialog}
          className="absolute left-0 top-full z-30 mt-3 w-full max-w-[22rem] xl:max-w-[24vw] rounded-2xl xl:rounded-[1.2vw] border border-white/15 bg-[#161616] p-5 xl:p-[1.4vw] text-white shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <p aria-live="polite" className="text-lg xl:text-[1.2vw]">
              {monthName.format(first)}
            </p>
            <div className="flex gap-2">
              {[
                { label: copy.previous, arrow: "←", to: 0 },
                { label: copy.next, arrow: "→", to: 1 },
              ].map((button) => (
                <button
                  key={button.to}
                  type="button"
                  aria-label={button.label}
                  disabled={offset === button.to}
                  onClick={() => {
                    setPicked(null);
                    show(button.to, 1);
                  }}
                  className="flex h-9 w-9 xl:h-[2.4vw] xl:w-[2.4vw] cursor-pointer items-center justify-center rounded-full border border-white/30 transition-colors duration-300 hover:border-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/30"
                >
                  <span aria-hidden>{button.arrow}</span>
                </button>
              ))}
            </div>
          </div>

          <table ref={grid} role="grid" aria-label={monthName.format(first)} className="mt-4 w-full table-fixed" onKeyDown={onGridKey}>
            <thead>
              <tr>
                {copy.weekdays.map((weekday) => (
                  <th key={weekday} scope="col" abbr={weekday} className="pb-2 text-center text-xs xl:text-[0.75vw] font-normal tracking-widest text-white/40">
                    {weekday[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, row) => (
                <tr key={row}>
                  {week.map((day, column) =>
                    day ? (
                      <td key={column} role="gridcell" aria-selected={day.day === pickedDay?.day} className="p-0.5 text-center">
                        <button
                          type="button"
                          data-day={day.day}
                          tabIndex={day.day === focused ? 0 : -1}
                          aria-disabled={!day.slots.length}
                          aria-label={`${longDate.format(day.date)}, ${day.slots.length ? copy.free : copy.booked}`}
                          onClick={() => day.slots.length && pickDay(day.day)}
                          onFocus={() => setFocused(day.day)}
                          className={`mx-auto flex h-9 w-9 xl:h-[2.4vw] xl:w-[2.4vw] items-center justify-center rounded-full text-sm xl:text-[0.9vw] tabular-nums transition-colors duration-300 ${
                            day.today ? "underline underline-offset-4" : ""
                          } ${
                            day.day === pickedDay?.day
                              ? "cursor-pointer border border-white bg-white text-black"
                              : day.slots.length
                                ? "cursor-pointer border border-white/45 hover:border-white"
                                : `cursor-default ${day.past ? "text-white/15" : day.weekday > 4 ? "text-white/25" : "text-white/40"}`
                          }`}
                        >
                          {day.day}
                        </button>
                      </td>
                    ) : (
                      <td key={column} />
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 border-t border-white/15 pt-4 min-h-24">
            {pickedDay ? (
              <div ref={times} role="group" aria-label={`${copy.times}, ${longDate.format(pickedDay.date)}`}>
                <p className="text-sm xl:text-[0.9vw] text-white/60">{longDate.format(pickedDay.date)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pickedDay.slots.map((slot) => {
                    const chosen = value === slotValue(pickedDay.date, slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        aria-pressed={chosen}
                        onClick={() => pickTime(slot)}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm xl:text-[0.9vw] tabular-nums transition-colors duration-300 ${
                          chosen ? "border-white bg-white text-black" : "border-white/30 hover:border-white"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm xl:text-[0.9vw] text-white/60">{free.length ? copy.note : copy.none}</p>
            )}
          </div>

          {value && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                close();
              }}
              className="mt-3 cursor-pointer text-xs xl:text-[0.8vw] uppercase tracking-[0.25rem] text-white/60 hover:text-white"
            >
              {copy.clear}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

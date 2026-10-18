"use client";

import { useState, useSyncExternalStore } from "react";
import { contactPage } from "@/content/sections";
import { monthAvailability } from "@/lib/availability";

const copy = contactPage.availability;
const monthName = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });

// Today's date only exists in the browser: the page is static, so the server renders a
// placeholder and the calendar fills in after hydration, always for the visitor's today
const subscribe = () => () => {};
const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
};

// When Ethan can be reached: this month and the next, with the free days highlighted.
// Picking one shows its call windows.
export function AvailabilityCalendar() {
  const key = useSyncExternalStore(subscribe, todayKey, () => null);
  const [offset, setOffset] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  if (!key) return <div aria-hidden className="min-h-[26rem]" />;

  const [year, month, date] = key.split("-").map(Number);
  const first = new Date(year, month + offset, 1);
  const days = monthAvailability(first.getFullYear(), first.getMonth(), new Date(year, month, date));
  const open = days.filter((day) => day.slots.length);
  const selected = open.find((day) => day.day === picked) ?? open[0];

  const showMonth = (next: number) => {
    setOffset(next);
    setPicked(null);
  };

  return (
    <div className="normal-case">
      <p className="text-base xl:text-[1.1vw] leading-relaxed text-white/70">{copy.intro}</p>

      <div className="mt-6 xl:mt-[1.5vw] flex items-center justify-between">
        <p className="text-lg xl:text-[1.3vw]" aria-live="polite">
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
              onClick={() => showMonth(button.to)}
              className="flex h-10 w-10 xl:h-[2.6vw] xl:w-[2.6vw] items-center justify-center rounded-full border border-white/30 text-base xl:text-[1vw] transition-colors duration-300 hover:border-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/30"
            >
              <span aria-hidden>{button.arrow}</span>
            </button>
          ))}
        </div>
      </div>

      <div aria-hidden className="mt-4 grid grid-cols-7 text-center text-xs xl:text-[0.75vw] tracking-widest text-white/40">
        {copy.weekdays.map((weekday) => (
          <span key={weekday}>{weekday[0]}</span>
        ))}
      </div>

      <ol className="mt-2 grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const free = day.slots.length > 0;
          const isSelected = free && day.day === selected?.day;
          const status = free ? `${copy.open}: ${day.slots.join(", ")}` : copy.booked;
          const cell = `mx-auto flex h-9 w-9 sm:h-10 sm:w-10 xl:h-[2.6vw] xl:w-[2.6vw] items-center justify-center rounded-full text-sm xl:text-[0.95vw] tabular-nums ${
            day.today ? "underline underline-offset-4" : ""
          }`;
          return (
            <li key={day.day} style={day.day === 1 ? { gridColumnStart: day.weekday + 1 } : undefined}>
              {free ? (
                <button
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${longDate.format(day.date)}. ${status}`}
                  onClick={() => setPicked(day.day)}
                  className={`${cell} border transition-colors duration-300 ${
                    isSelected ? "border-white bg-white text-black" : "border-white/45 text-white hover:border-white"
                  }`}
                >
                  {day.day}
                </button>
              ) : (
                <span
                  className={`${cell} ${day.past ? "text-white/15" : day.weekday > 4 ? "text-white/25" : "text-white/40"}`}
                >
                  <span className="sr-only">{longDate.format(day.date)}. </span>
                  {day.day}
                  {!day.past && <span className="sr-only">. {copy.booked}</span>}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div aria-live="polite" className="mt-6 xl:mt-[1.5vw] min-h-20 border-t border-white/20 pt-4 xl:pt-[1vw]">
        {selected ? (
          <>
            <p className="text-lg xl:text-[1.3vw]">{longDate.format(selected.date)}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {selected.slots.map((slot) => (
                <li
                  key={slot}
                  className="rounded-full border border-white/30 px-3 py-1 text-sm xl:text-[0.9vw] tabular-nums text-white/80"
                >
                  {slot}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-base xl:text-[1.1vw] text-white/60">{copy.none}</p>
        )}
      </div>

      <div className="mt-4 flex text-sm xl:text-[0.85vw] text-white/60">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-3 xl:h-[0.8vw] xl:w-[0.8vw] rounded-full border border-white/60" />
          {copy.open}
        </span>
      </div>
      <p className="mt-3 text-sm xl:text-[0.85vw] leading-relaxed text-white/50">{copy.note}</p>
    </div>
  );
}

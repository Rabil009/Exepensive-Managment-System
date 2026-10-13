"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

const defaultFieldClass = "w-full h-9 bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/[0.08] rounded-lg px-3 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-colors";

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.getFullYear() === Number(match[1]) &&
    date.getMonth() === Number(match[2]) - 1 &&
    date.getDate() === Number(match[3])
    ? date
    : null;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function displayDate(value: string) {
  const date = parseDate(value);
  return date
    ? `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`
    : "yyyy/mm/dd";
}

export function DatePicker({ id, value, onChange, className = defaultFieldClass }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [choosingMonth, setChoosingMonth] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = parseDate(value) || new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setChoosingMonth(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setChoosingMonth(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const selected = parseDate(value);
  const firstWeekday = visibleMonth.getDay();
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const calendarCells = Array.from(
    { length: Math.ceil((firstWeekday + daysInMonth) / 7) * 7 },
    (_, index) => index - firstWeekday + 1,
  );

  const moveMonth = (amount: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const chooseDate = (date: Date) => {
    onChange(dateKey(date));
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setOpen(false);
    setChoosingMonth(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${id}-calendar`}
        onClick={() => {
          if (!open) {
            const date = parseDate(value) || new Date();
            setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
          }
          setOpen((current) => !current);
          setChoosingMonth(false);
        }}
        className={`${className} flex items-center justify-between text-left cursor-pointer ${
          value ? "" : "text-zinc-400 dark:text-zinc-500"
        }`}
      >
        <span className="tabular-nums">{displayDate(value)}</span>
        <CalendarDays aria-hidden="true" className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
      </button>

      {open && (
        <div
          id={`${id}-calendar`}
          role="dialog"
          aria-label="Choose expense date"
          className="absolute top-full left-0 z-50 mt-2 w-[272px] max-w-[calc(100vw-32px)] rounded-xl border border-zinc-700 bg-[#37373A] p-2.5 font-sans text-zinc-100 shadow-xl shadow-black/25"
        >
          <div className="grid grid-cols-[28px_1fr_28px] items-center pb-1">
            <button
              type="button"
              aria-label={choosingMonth ? "Previous year" : "Previous month"}
              onClick={() => choosingMonth
                ? setVisibleMonth((current) => new Date(current.getFullYear() - 1, current.getMonth(), 1))
                : moveMonth(-1)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-300 hover:bg-white/[0.1] hover:text-white"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Choose month and year"
              aria-expanded={choosingMonth}
              onClick={() => setChoosingMonth((current) => !current)}
              className="rounded-md py-1 text-center text-xs font-semibold tracking-tight hover:bg-white/[0.1]"
            >
              {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
            </button>
            <button
              type="button"
              aria-label={choosingMonth ? "Next year" : "Next month"}
              onClick={() => choosingMonth
                ? setVisibleMonth((current) => new Date(current.getFullYear() + 1, current.getMonth(), 1))
                : moveMonth(1)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-300 hover:bg-white/[0.1] hover:text-white"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>

          {choosingMonth ? (
            <div className="grid grid-cols-3 gap-1 py-2">
              {monthNames.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => {
                    setVisibleMonth(new Date(visibleMonth.getFullYear(), index, 1));
                    setChoosingMonth(false);
                  }}
                  className={`rounded-lg py-2 text-xs transition-colors ${
                    visibleMonth.getMonth() === index
                      ? "bg-white font-semibold text-zinc-900"
                      : "text-zinc-200 hover:bg-white/[0.1]"
                  }`}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-y-0.5 py-1 text-center">
                {weekdays.map((day) => (
                  <span key={day} className="py-1.5 text-[11px] font-medium text-zinc-400">
                    {day}
                  </span>
                ))}
                {calendarCells.map((dayNumber, index) => {
                  if (dayNumber < 1 || dayNumber > daysInMonth) {
                    return <span key={`empty-${index}`} className="h-8" aria-hidden="true" />;
                  }
                  const day = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), dayNumber);
                  const isSelected = selected && dateKey(day) === dateKey(selected);
                  return (
                    <button
                      key={dateKey(day)}
                      type="button"
                      aria-label={day.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                      aria-pressed={Boolean(isSelected)}
                      onClick={() => chooseDate(day)}
                      className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        isSelected
                          ? "bg-white font-semibold text-zinc-900"
                          : "text-zinc-200 hover:bg-white/[0.12] hover:text-white"
                      }`}
                    >
                      {dayNumber}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

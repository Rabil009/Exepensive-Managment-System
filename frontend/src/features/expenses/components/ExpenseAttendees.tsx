"use client";

import React from "react";
import { UserPlus, X, Users } from "lucide-react";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";
import { fieldClass } from "../styles/formClasses";

type Props = {
  model: Pick<
    ExpenseFormModel,
    | "draft"
    | "update"
    | "attendee"
    | "setAttendee"
    | "addingAttendee"
    | "setAddingAttendee"
    | "addAttendee"
  >;
};

export function ExpenseAttendees({ model }: Props) {
  const {
    draft,
    update,
    attendee,
    setAttendee,
    addingAttendee,
    setAddingAttendee,
    addAttendee,
  } = model;

  return (
    <section className="flex flex-col gap-4">
      <div className="pb-1 border-b border-zinc-100 dark:border-white/[0.05]">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Attendees &amp; Business Purpose
        </h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="business-purpose"
          className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
        >
          Business Purpose
        </label>
        <input
          id="business-purpose"
          className={fieldClass}
          placeholder="Describe why this expense was needed for business"
          value={draft.purpose}
          onChange={(event) => update("purpose", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-zinc-400" />
            <span>Attendees</span>
          </label>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {draft.attendees.length}{" "}
            {draft.attendees.length === 1 ? "attendee" : "attendees"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {draft.attendees.map((name, index) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-white/[0.04] px-2.5 py-1 rounded-full border border-zinc-200/80 dark:border-white/[0.08] text-xs text-zinc-800 dark:text-zinc-200 shadow-xs"
            >
              <span className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[9px] flex items-center justify-center font-bold">
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <span className="text-xs font-medium">{name}</span>
              {index === 0 ? (
                <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase font-semibold">
                  You
                </span>
              ) : (
                <button
                  type="button"
                  aria-label={`Remove ${name}`}
                  className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  onClick={() =>
                    update(
                      "attendees",
                      draft.attendees.filter((item) => item !== name),
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#161619] hover:bg-zinc-50 dark:hover:bg-[#1E1E24] text-xs font-medium border border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer shadow-xs"
            onClick={() => setAddingAttendee(true)}
          >
            <UserPlus className="h-3.5 w-3.5 text-zinc-400" />
            <span>Add Attendee</span>
          </button>
        </div>

        {addingAttendee && (
          <div className="flex gap-2 mt-1">
            <input
              autoFocus
              className={fieldClass}
              aria-label="Attendee name"
              placeholder="Full name"
              value={attendee}
              onChange={(event) => setAttendee(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addAttendee();
                }
              }}
            />
            <button
              type="button"
              className="h-9 px-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
              onClick={addAttendee}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ExpenseAttendees;

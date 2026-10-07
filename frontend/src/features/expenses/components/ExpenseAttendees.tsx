import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
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
    <section className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm">Attendees &amp; Notes</h2>
        <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">
          For meals and group expenses
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="business-purpose" className="text-label-md font-medium">
          Business Purpose
        </label>
        <input
          id="business-purpose"
          className={fieldClass}
          placeholder="Describe why this expense was needed for work"
          value={draft.purpose}
          onChange={(event) => update("purpose", event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-label-md font-medium">Attendees</label>
          <span className="text-label-caps px-2 py-0.5 rounded-full bg-surface-container-high">
            {draft.attendees.length} {draft.attendees.length === 1 ? "attendee" : "attendees"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {draft.attendees.map((name, index) => (
            <span
              key={name}
              className="inline-flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/30 shadow-sm"
            >
              <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary text-[9px] flex items-center justify-center font-bold">
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <span className="text-body-sm font-medium">{name}</span>
              {index === 0 ? (
                <span className="text-label-caps px-1.5 py-0.5 rounded bg-surface-container-high uppercase">
                  Organizer
                </span>
              ) : (
                <button
                  type="button"
                  aria-label={`Remove ${name}`}
                  onClick={() =>
                    update(
                      "attendees",
                      draft.attendees.filter((item) => item !== name),
                    )
                  }
                >
                  <Icon className="text-sm">close</Icon>
                </button>
              )}
            </span>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-label-md border border-outline-variant/30"
            onClick={() => setAddingAttendee(true)}
          >
            <Icon className="text-base text-primary-container">add</Icon>Add
            Attendee
          </button>
        </div>
        {addingAttendee && (
          <div className="flex gap-2">
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
              className="aura-draft-button"
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

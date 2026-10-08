import { useState, type ReactNode } from "react";
import { User } from "lucide-react";

/** Selectable demo previews; issuer controls below remain attached to Aura. */
export function CardStack({ children }: { children: ReactNode }) {
  const [active, setActive] = useState("aura");
  const order = ["aura", "apple", "personal"];
  const slotProps = (id: string, label: string) => ({
    type: "button" as const,
    "aria-label": `Select ${label} card`,
    "aria-pressed": active === id,
    className: `aura-card-slot ${active === id ? "is-active" : ""}`,
    style: {
      left: `${order.indexOf(id) * 15}%`,
      zIndex: 4 - Math.abs(order.indexOf(id) - order.indexOf(active)),
    },
    onClick: () => setActive(id),
    onFocus: () => setActive(id),
    onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType !== "touch") setActive(id);
    },
    onPointerDown: () => setActive(id),
  });
  return (
    <div className="aura-card-stack-container">
      <div
        className="aura-card-stack"
        aria-label="Aura card with Apple and personal demo cards"
      >
        <button {...slotProps("personal", "Personal")}>
          <article
            className="aura-stack-card aura-personal-card"
            aria-label="Personal demo card"
          >
            <div className="aura-stack-card-heading">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />Personal
              </span>
              <span className="aura-stack-card-label">DEMO</span>
            </div>
            <div className="aura-stack-card-number">
              ••••  ••••  ••••  2048
            </div>
            <div className="aura-stack-card-footer">
              <div className="aura-stack-card-details">
                <span className="aura-stack-card-field">Cardholder</span>
                <strong>RABIL KHAN</strong>
                <span className="aura-stack-card-field">Personal debit</span>
              </div>
              <div className="aura-stack-card-details">
                <span className="aura-stack-card-field">Expires</span>
                <strong>11/28</strong>
                <span className="font-bold italic">VISA</span>
              </div>
            </div>
          </article>
        </button>
        <button {...slotProps("apple", "Apple")}>
          <article
            className="aura-stack-card aura-apple-card"
            aria-label="Apple demo card"
          >
            <div className="aura-stack-card-heading">
              <span className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.1 12.6c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.2-2.8.8-3.5.8-.7 0-1.8-.8-3-.7-1.6 0-3 1-3.8 2.3-1.6 2.8-.4 6.9 1.2 9.2.8 1.1 1.6 2.2 2.8 2.1 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 1.9-1 2.7-2.1c.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.4-.9-2.4-3.8ZM14.8 6c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.8 1 .1 2.1-.5 2.8-1.2Z" />
                </svg>
                Apple Card
              </span>
              <span className="aura-stack-card-label">DEMO</span>
            </div>
            <div className="aura-stack-card-number">••••  ••••  ••••  8814</div>
            <div className="aura-stack-card-footer">
              <div className="aura-stack-card-details">
                <span className="aura-stack-card-field">Cardholder</span>
                <strong>Rabil Khan</strong>
                <span className="aura-stack-card-field">Digital card</span>
              </div>
              <div className="aura-stack-card-details">
                <span className="aura-stack-card-field">Expires</span>
                <strong>10/29</strong>
                <span className="font-bold italic">mastercard</span>
              </div>
            </div>
          </article>
        </button>
        <button {...slotProps("aura", "Aura")}>{children}</button>
      </div>
    </div>
  );
}

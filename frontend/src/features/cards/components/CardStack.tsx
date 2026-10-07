import type { ReactNode } from "react";
import { AuraIcon } from "../../../shared/components/AuraIcon";

/** Decorative demo cards; the Aura card owns the controls below this stack. */
export function CardStack({ children }: { children: ReactNode }) {
  return (
    <div className="aura-card-stack-scroll">
      <div
        className="aura-card-stack"
        aria-label="Aura card with Apple and personal demo cards"
      >
        <article
          className="aura-stack-card aura-personal-card"
          aria-label="Personal demo card"
        >
          <div className="aura-stack-card-heading">
            <span className="flex items-center gap-2">
              <AuraIcon className="text-lg">person</AuraIcon>Personal
            </span>
            <span className="aura-stack-card-label">DEMO</span>
          </div>
          <div className="aura-stack-card-number">
            {
              "\u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022"
            }
          </div>
          <div className="aura-stack-card-footer">
            <strong>RABIL KHAN</strong>
            <span>Personal card</span>
          </div>
        </article>
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
          <div className="aura-stack-card-footer">
            <strong>Rabil Khan</strong>
            <span className="font-bold italic">mastercard</span>
          </div>
        </article>
        {children}
      </div>
    </div>
  );
}

export type ClaraStep = "show" | "check" | "decide";

const STEPS: { id: ClaraStep; label: string }[] = [
  { id: "show", label: "Show" },
  { id: "check", label: "Check" },
  { id: "decide", label: "Decide" },
];

const STATE_TEXT = {
  complete: "Completed",
  current: "Current step",
  upcoming: "Not started yet",
} as const;

type ProgressStepsProps = {
  current: ClaraStep;
};

export function ProgressSteps({ current }: ProgressStepsProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);

  return (
    <nav className="clara-progress" aria-label="Your progress">
      <ol className="clara-progress__list">
        {STEPS.map((step, index) => {
          const state =
            index < currentIndex
              ? "complete"
              : index === currentIndex
                ? "current"
                : "upcoming";

          return (
            <li
              key={step.id}
              className="clara-progress__step"
              data-state={state}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span aria-hidden="true" className="clara-progress__dot">
                {index + 1}
              </span>
              <span className="clara-progress__label">{step.label}</span>
              <span className="clara-sr-only">
                {step.label}. {STATE_TEXT[state]}.
              </span>
              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="clara-progress__line"
                  data-state={index < currentIndex ? "complete" : "upcoming"}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

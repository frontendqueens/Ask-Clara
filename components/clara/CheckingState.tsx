const CHECKS = [
  "Checking who sent it",
  "Looking for pressure or urgency",
  "Checking the payment request",
];

export function CheckingState() {
  return (
    <section
      aria-live="polite"
      aria-busy="true"
      className="clara-checking"
      aria-labelledby="checking-title"
    >
      <span aria-hidden="true" className="clara-checking__mark">
        C
      </span>
      <h2 id="checking-title" className="clara-checking__title">
        Clara is looking carefully
      </h2>
      <ul className="clara-checking__list">
        {CHECKS.map((check) => (
          <li key={check}>
            <span aria-hidden="true" className="clara-checking__pip" />
            {check}
          </li>
        ))}
      </ul>
    </section>
  );
}

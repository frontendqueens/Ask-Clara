import { Lock } from "lucide-react";
import { ClaraChecker } from "@/components/clara/ClaraChecker";
import { SiteHeader } from "@/components/clara/SiteHeader";

const ASSURANCES = [
  "Plain, familiar words",
  "No pressure to decide",
  "A trusted person can help",
];

const HOW_IT_WORKS = [
  {
    step: "Step one",
    title: "Show Clara",
    body:
      "Paste the message, add a screenshot, or tell Clara what happened in your own words.",
  },
  {
    step: "Step two",
    title: "Clara checks",
    body:
      "Clara looks at who sent it, whether it pressures you, and what it is asking you to do.",
  },
  {
    step: "Step three",
    title: "You decide",
    body:
      "You get the warning signs in plain words, one safe next step, and a way to ask someone you trust.",
  },
];

export default function Home() {
  return (
    <div className="clara-page">
      <SiteHeader />

      <main id="ask-clara" className="clara-shell">
        <section className="clara-welcome" aria-labelledby="welcome-title">
          <p className="clara-eyebrow clara-welcome__eyebrow">
            You are in control
          </p>
          <h2 id="welcome-title" className="clara-welcome__title">
            Something feels off?
            <span>Let’s look together.</span>
          </h2>
          <p className="clara-welcome__body">
            Show Clara a message or describe what happened. She’ll explain the
            warning signs and give you one safe next step.
          </p>

          <div className="clara-promise">
            <h3 className="clara-promise__title">
              <Lock aria-hidden="true" size={18} />
              Clara’s promise
            </h3>
            <p className="clara-promise__body">
              Your information is processed for this check and is not saved by
              Clara.
            </p>
          </div>

          <ul className="clara-assurances">
            {ASSURANCES.map((assurance, index) => (
              <li key={assurance}>
                <span aria-hidden="true" className="clara-assurances__num">
                  {index + 1}
                </span>
                {assurance}
              </li>
            ))}
          </ul>
        </section>

        <ClaraChecker />
      </main>

      <section
        id="how-it-works"
        className="clara-support"
        aria-labelledby="how-it-works-title"
      >
        <h2 id="how-it-works-title" className="clara-support__heading">
          How it works
        </h2>
        {HOW_IT_WORKS.map((item) => (
          <div key={item.title} className="clara-support__card">
            <p className="clara-support__step">{item.step}</p>
            <h3 className="clara-support__title">{item.title}</h3>
            <p className="clara-support__body">{item.body}</p>
          </div>
        ))}
      </section>

      <footer className="clara-footer">
        <p>
          Clara gives a second opinion. She does not replace your bank, law
          enforcement, or a person you trust.
        </p>
      </footer>
    </div>
  );
}

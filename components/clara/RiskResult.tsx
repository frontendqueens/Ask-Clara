"use client";

import { useEffect, useRef } from "react";
import {
  ArrowRight,
  CircleAlert,
  Info,
  Phone,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";
import type { ClaraAnalysis, ClaraRisk } from "@/types/analysis";

const RISK_LABELS: Record<ClaraRisk, string> = {
  low_concern: "Low concern",
  caution: "Caution",
  likely_scam: "Likely scam",
  unclear: "Unclear",
};

/**
 * Every verdict states its meaning in words as well as colour, so the result
 * never depends on the palette alone.
 */
const RISK_EYEBROWS: Record<ClaraRisk, string> = {
  low_concern: "No clear warning signs",
  caution: "Caution — take your time",
  likely_scam: "Stop — likely a scam",
  unclear: "Not enough to be sure",
};

const RISK_ICONS: Record<ClaraRisk, typeof TriangleAlert> = {
  low_concern: ShieldCheck,
  caution: CircleAlert,
  likely_scam: TriangleAlert,
  unclear: Info,
};

type RiskResultProps = {
  analysis: ClaraAnalysis;
  onStartOver: () => void;
  onAskTrustedPerson: () => void;
};

export function RiskResult({
  analysis,
  onStartOver,
  onAskTrustedPerson,
}: RiskResultProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const RiskIcon = RISK_ICONS[analysis.risk];

  // Move focus to the verdict so screen reader and keyboard users land on the
  // answer instead of having to hunt for it.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      aria-live="polite"
      className="clara-result"
      data-risk={analysis.risk}
      aria-labelledby="result-headline"
    >
      <div className="clara-verdict">
        <RiskIcon
          aria-hidden="true"
          size={32}
          className="clara-verdict__icon"
        />
        <div>
          <p className="clara-eyebrow clara-verdict__eyebrow">
            {RISK_EYEBROWS[analysis.risk]}
          </p>
          <h2
            id="result-headline"
            ref={headingRef}
            tabIndex={-1}
            className="clara-verdict__headline"
          >
            {analysis.headline}
          </h2>
          <p className="clara-sr-only">
            Risk level: {RISK_LABELS[analysis.risk]}.
          </p>
          <p className="clara-verdict__summary">{analysis.summary}</p>
        </div>
      </div>

      <div>
        <h3 className="clara-block__title">Warning signs</h3>
        <ol className="clara-signs">
          {analysis.warningSigns.map((sign) => (
            <li key={sign}>{sign}</li>
          ))}
        </ol>
      </div>

      <div className="clara-safest">
        <Phone aria-hidden="true" size={28} className="clara-safest__icon" />
        <div>
          <p className="clara-eyebrow clara-safest__eyebrow">
            Your safest next step
          </p>
          <p className="clara-safest__body">{analysis.safestNextStep}</p>
        </div>
      </div>

      <div className="clara-actions">
        <button
          type="button"
          onClick={onAskTrustedPerson}
          className="clara-btn clara-btn--primary"
        >
          <Users aria-hidden="true" size={20} />
          Ask someone trusted
          <ArrowRight
            aria-hidden="true"
            size={20}
            className="clara-btn__arrow"
          />
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="clara-btn clara-btn--secondary"
        >
          Start over
        </button>
      </div>

      <p className="clara-disclaimer">{analysis.disclaimer}</p>
    </section>
  );
}

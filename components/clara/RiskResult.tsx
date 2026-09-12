import { TriangleAlert } from "lucide-react";
import type { ClaraAnalysis, ClaraRisk } from "@/types/analysis";

const RISK_LABELS: Record<ClaraRisk, string> = {
  low_concern: "Low concern",
  caution: "Caution",
  likely_scam: "Likely scam",
  unclear: "Unclear",
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
  return (
    <section aria-live="polite" className="space-y-4">
      <h2 className="text-2xl font-semibold">Clara&apos;s second opinion</h2>
      <p className="flex items-start gap-2 font-semibold">
        <TriangleAlert aria-hidden="true" className="mt-1 size-6 shrink-0" />
        <span>Risk level: {RISK_LABELS[analysis.risk]}</span>
      </p>
      <h3 className="text-xl font-semibold">{analysis.headline}</h3>
      <p>{analysis.summary}</p>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Warning signs</h3>
        <ul className="list-disc space-y-1 pl-6">
          {analysis.warningSigns.map((sign) => (
            <li key={sign}>{sign}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Safest next step</h3>
        <p>{analysis.safestNextStep}</p>
      </div>
      <p>{analysis.disclaimer}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onAskTrustedPerson}
          className="rounded border border-zinc-800 px-4 py-3"
        >
          Ask a trusted person
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="rounded border border-zinc-800 px-4 py-3"
        >
          Start over
        </button>
      </div>
    </section>
  );
}

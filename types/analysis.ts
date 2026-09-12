export type ClaraRisk =
  | "low_concern"
  | "caution"
  | "likely_scam"
  | "unclear";

export type ClaraAnalysis = {
  risk: ClaraRisk;
  headline: string;
  summary: string;
  warningSigns: string[];
  safestNextStep: string;
  trustedPersonSummary: string;
  disclaimer: string;
};

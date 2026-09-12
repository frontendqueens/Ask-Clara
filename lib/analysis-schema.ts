import { z } from "zod";

export const claraRiskSchema = z.enum([
  "low_concern",
  "caution",
  "likely_scam",
  "unclear",
]);

export const claraAnalysisSchema = z.object({
  risk: claraRiskSchema,
  headline: z.string().min(1),
  summary: z.string().min(1),
  warningSigns: z.array(z.string().min(1)).min(1).max(3),
  safestNextStep: z.string().min(1),
  trustedPersonSummary: z.string().min(1),
  disclaimer: z.string().min(1),
});

export const analyzeRequestSchema = z.object({
  type: z.string().optional(),
  content: z.string().trim().min(1),
});

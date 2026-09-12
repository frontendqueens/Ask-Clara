import { z } from "zod";

export const claraRiskSchema = z.enum([
  "low_concern",
  "caution",
  "likely_scam",
  "unclear",
]);

export const claraAnalysisSchema = z.object({
  risk: claraRiskSchema.describe(
    "How concerning the message is: low_concern, caution, likely_scam, or unclear.",
  ),
  headline: z
    .string()
    .min(1)
    .describe("A short, direct instruction. Example: Do not reply or pay."),
  summary: z
    .string()
    .min(1)
    .describe("A plain-language explanation of what is happening and why."),
  warningSigns: z
    .array(z.string().min(1))
    .min(1)
    .max(3)
    .describe("One to three warning signs, written as short sentences."),
  safestNextStep: z
    .string()
    .min(1)
    .describe(
      "The safest next action. Prefer calling a number the person already has, or asking a trusted person.",
    ),
  trustedPersonSummary: z
    .string()
    .min(1)
    .describe(
      "A short note the person can share with someone they trust, written in first person.",
    ),
  disclaimer: z
    .string()
    .min(1)
    .describe("A brief reminder that Clara is only a second opinion."),
});

export const analyzeRequestSchema = z.object({
  type: z.string().optional(),
  content: z.string().trim().min(1),
});

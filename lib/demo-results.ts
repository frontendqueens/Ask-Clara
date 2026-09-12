import type { ClaraAnalysis } from "@/types/analysis";

export const CLARA_DISCLAIMER =
  "Clara provides a second opinion. It does not guarantee that a message is safe, make financial decisions, or replace a bank, law enforcement, or a trusted person.";

export const demoGiftCardScamResult: ClaraAnalysis = {
  risk: "likely_scam",
  headline: "Do not reply or pay.",
  summary:
    "This message tries to rush you into acting right away. Banks do not ask customers to pay with gift cards, and an unfamiliar link can be used to steal your information.",
  warningSigns: [
    "The sender is creating urgency so you act before thinking.",
    "Banks do not request gift-card payments.",
    "The message includes an unfamiliar link that you should not open.",
  ],
  safestNextStep:
    "Call the bank using the phone number on the back of your card. Do not use any number or link from the message.",
  trustedPersonSummary:
    "Clara found warning signs in this message, and I would like a second opinion before I reply, click, or send money.",
  disclaimer: CLARA_DISCLAIMER,
};

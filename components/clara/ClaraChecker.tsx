"use client";

import { type FormEvent, useState } from "react";
import { claraAnalysisSchema } from "@/lib/analysis-schema";
import type { ClaraAnalysis } from "@/types/analysis";
import { CheckingState } from "./CheckingState";
import { InputChoices, type InputChoice } from "./InputChoices";
import { MessageInput } from "./MessageInput";
import { RiskResult } from "./RiskResult";
import { ScreenshotInput } from "./ScreenshotInput";
import { TextSizeControl, type TextSize } from "./TextSizeControl";
import { TrustedPersonDialog } from "./TrustedPersonDialog";

type View = "form" | "checking" | "result";

const TEXT_SIZE_CLASS: Record<TextSize, string> = {
  small: "text-base",
  medium: "text-lg",
  large: "text-2xl",
};

export function ClaraChecker() {
  const [inputType, setInputType] = useState<InputChoice>("message");
  const [message, setMessage] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [view, setView] = useState<View>("form");
  const [analysis, setAnalysis] = useState<ClaraAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [textSize, setTextSize] = useState<TextSize>("medium");
  const [trustedOpen, setTrustedOpen] = useState(false);

  const content =
    inputType === "message"
      ? message
      : screenshot
        ? `Screenshot uploaded: ${screenshot.name}`
        : "";

  const canSubmit = content.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setError("Please enter a message or upload a screenshot first.");
      return;
    }

    setError(null);
    setView("checking");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: inputType, content }),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const messageFromApi =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Clara could not check this message.";
        throw new Error(messageFromApi);
      }

      const parsed = claraAnalysisSchema.safeParse(data);

      if (!parsed.success) {
        throw new Error("Clara returned an unexpected result. Please try again.");
      }

      setAnalysis(parsed.data);
      setView("result");
    } catch (err) {
      setAnalysis(null);
      setView("form");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  function handleStartOver() {
    setView("form");
    setAnalysis(null);
    setError(null);
    setTrustedOpen(false);
  }

  return (
    <div className={`space-y-6 ${TEXT_SIZE_CLASS[textSize]}`}>
      <TextSizeControl value={textSize} onChange={setTextSize} />

      {error ? (
        <p role="alert" aria-live="assertive">
          {error}
        </p>
      ) : null}

      {view === "checking" ? <CheckingState /> : null}

      {view === "result" && analysis ? (
        <RiskResult
          analysis={analysis}
          onStartOver={handleStartOver}
          onAskTrustedPerson={() => setTrustedOpen(true)}
        />
      ) : null}

      {view === "form" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold">
            What would you like Clara to check?
          </h2>
          <InputChoices value={inputType} onChange={setInputType} />
          {inputType === "message" ? (
            <MessageInput value={message} onChange={setMessage} />
          ) : (
            <ScreenshotInput file={screenshot} onChange={setScreenshot} />
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded border border-zinc-800 px-4 py-3 disabled:opacity-50"
          >
            Check it with Clara
          </button>
        </form>
      ) : null}

      <TrustedPersonDialog
        open={trustedOpen}
        summary={analysis?.trustedPersonSummary ?? ""}
        onClose={() => setTrustedOpen(false)}
      />
    </div>
  );
}

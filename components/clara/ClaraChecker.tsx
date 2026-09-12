"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { claraAnalysisSchema } from "@/lib/analysis-schema";
import type { ClaraAnalysis } from "@/types/analysis";
import { CheckingState } from "./CheckingState";
import { InputChoices, type InputChoice } from "./InputChoices";
import { MessageInput } from "./MessageInput";
import { ProgressSteps, type ClaraStep } from "./ProgressSteps";
import { RiskResult } from "./RiskResult";
import { ScreenshotInput } from "./ScreenshotInput";
import { TrustedPersonDialog } from "./TrustedPersonDialog";

type View = "form" | "checking" | "result";

const STEP_FOR_VIEW: Record<View, ClaraStep> = {
  form: "show",
  checking: "check",
  result: "decide",
};

const TELL_COPY = {
  label: "What happened?",
  help: "Tell Clara in your own words. There is no wrong way to say it.",
  placeholder:
    "Someone called about my account and asked me to buy gift cards.",
};

export function ClaraChecker() {
  const [inputType, setInputType] = useState<InputChoice>("message");
  const [message, setMessage] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [view, setView] = useState<View>("form");
  const [analysis, setAnalysis] = useState<ClaraAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trustedOpen, setTrustedOpen] = useState(false);

  const content =
    inputType === "screenshot"
      ? screenshot
        ? `Screenshot uploaded: ${screenshot.name}`
        : ""
      : message;

  const canSubmit = content.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setError(
        inputType === "screenshot"
          ? "Please add a screenshot first."
          : "Please add the message first.",
      );
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
    setMessage("");
    setScreenshot(null);
  }

  return (
    <div className="clara-checker">
      <ProgressSteps current={STEP_FOR_VIEW[view]} />

      {error ? (
        <p role="alert" aria-live="assertive" className="clara-error">
          <TriangleAlert aria-hidden="true" size={22} />
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
        <form onSubmit={handleSubmit} className="clara-form">
          <div>
            <h2 className="clara-checker__heading">
              What would you like Clara to check?
            </h2>
            <p className="clara-checker__hint">
              Take your time. Nothing is sent anywhere until you press the
              button.
            </p>
          </div>

          <InputChoices value={inputType} onChange={setInputType} />

          {inputType === "screenshot" ? (
            <ScreenshotInput file={screenshot} onChange={setScreenshot} />
          ) : inputType === "tell" ? (
            <MessageInput
              value={message}
              onChange={setMessage}
              label={TELL_COPY.label}
              help={TELL_COPY.help}
              placeholder={TELL_COPY.placeholder}
            />
          ) : (
            <MessageInput value={message} onChange={setMessage} />
          )}

          <div className="clara-actions">
            <button
              type="submit"
              disabled={!canSubmit}
              className="clara-btn clara-btn--primary"
            >
              Check it with Clara
              <ArrowRight
                aria-hidden="true"
                size={20}
                className="clara-btn__arrow"
              />
            </button>
          </div>
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

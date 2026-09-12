"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, X } from "lucide-react";

type TrustedPersonDialogProps = {
  open: boolean;
  summary: string;
  onClose: () => void;
};

export function TrustedPersonDialog({
  open,
  summary,
  onClose,
}: TrustedPersonDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const trimmedName = name.trim();
  const shareText = trimmedName
    ? `Hi ${trimmedName}, ${summary}`
    : summary;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      setStatus("");
      dialog.showModal();
      nameRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Fires for the close button and for the Escape key.
  function handleClose() {
    previouslyFocused.current?.focus();
    onClose();
  }

  async function handlePrepare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text: shareText });
        setStatus("Your message was passed to your sharing options.");
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          setStatus("Sharing stopped. Nothing was sent.");
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setStatus("Message copied. You can paste it into a text or email.");
    } catch {
      setStatus(
        "Copying did not work. Select the message above and copy it yourself.",
      );
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-labelledby="trusted-person-title"
      className="clara-dialog"
    >
      <div className="clara-dialog__inner">
        <div className="clara-dialog__head">
          <div>
            <p className="clara-eyebrow clara-dialog__eyebrow">
              You don’t have to decide alone
            </p>
            <h2 id="trusted-person-title" className="clara-dialog__title">
              Ask someone you trust
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="clara-dialog__close"
            aria-label="Close"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <div className="clara-field">
          <label htmlFor="trusted-person-name" className="clara-label">
            Who would you like to ask?
          </label>
          <input
            id="trusted-person-name"
            ref={nameRef}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="A daughter, a neighbour, a friend"
            autoComplete="off"
            className="clara-input"
          />
        </div>

        <div className="clara-field">
          <h3 className="clara-label" id="trusted-person-preview-label">
            Your message
          </h3>
          <p
            className="clara-preview"
            aria-labelledby="trusted-person-preview-label"
          >
            {shareText}
          </p>
        </div>

        <p className="clara-dialog__status" role="status" aria-live="polite">
          {status}
        </p>

        <div className="clara-actions">
          <button
            type="button"
            onClick={handlePrepare}
            className="clara-btn clara-btn--primary"
          >
            <Copy aria-hidden="true" size={20} />
            Prepare message
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="clara-btn clara-btn--secondary"
          >
            Close
          </button>
        </div>

        <p className="clara-dialog__note">
          Clara never contacts anyone for you. You choose when and how to send
          this.
        </p>
      </div>
    </dialog>
  );
}

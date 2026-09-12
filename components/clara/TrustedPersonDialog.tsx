"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="trusted-person-title"
      className="w-full max-w-lg space-y-4 rounded p-6"
    >
      <h2 id="trusted-person-title" className="text-2xl font-semibold">
        Share with a trusted person
      </h2>
      <p>{summary}</p>
      <button
        type="button"
        onClick={onClose}
        className="rounded border border-zinc-800 px-4 py-3"
      >
        Close
      </button>
    </dialog>
  );
}

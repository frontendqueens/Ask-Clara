import { Check } from "lucide-react";

type ScreenshotInputProps = {
  file: File | null;
  onChange: (file: File | null) => void;
};

export function ScreenshotInput({ file, onChange }: ScreenshotInputProps) {
  return (
    <div className="clara-field">
      <label htmlFor="suspicious-screenshot" className="clara-label">
        Screenshot of the message
      </label>
      <p id="suspicious-screenshot-help" className="clara-help">
        A photo or screenshot of the message works well.
      </p>
      <div className="clara-dropzone">
        <input
          id="suspicious-screenshot"
          name="screenshot"
          type="file"
          accept="image/*"
          aria-describedby="suspicious-screenshot-help"
          className="clara-file"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
        <p className="clara-file-status" aria-live="polite">
          {file ? (
            <>
              <Check aria-hidden="true" size={18} strokeWidth={3} />
              Added: {file.name}
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}

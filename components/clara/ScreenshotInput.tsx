type ScreenshotInputProps = {
  file: File | null;
  onChange: (file: File | null) => void;
};

export function ScreenshotInput({ file, onChange }: ScreenshotInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="suspicious-screenshot" className="font-semibold">
        Screenshot of the message
      </label>
      <input
        id="suspicious-screenshot"
        name="screenshot"
        type="file"
        accept="image/*"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      {file ? <p>Selected file: {file.name}</p> : null}
    </div>
  );
}

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  help?: string;
  placeholder?: string;
};

export function MessageInput({
  value,
  onChange,
  label = "Suspicious message",
  help = "Clara reads it for this check only.",
  placeholder = "Paste the text you received here.",
}: MessageInputProps) {
  return (
    <div className="clara-field">
      <label htmlFor="suspicious-message" className="clara-label">
        {label}
      </label>
      <p id="suspicious-message-help" className="clara-help">
        {help}
      </p>
      <textarea
        id="suspicious-message"
        name="content"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        placeholder={placeholder}
        aria-describedby="suspicious-message-help"
        className="clara-textarea"
      />
    </div>
  );
}

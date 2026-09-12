type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MessageInput({ value, onChange }: MessageInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="suspicious-message" className="font-semibold">
        Suspicious message
      </label>
      <textarea
        id="suspicious-message"
        name="content"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        placeholder="Paste the text you received here."
        className="w-full rounded border border-zinc-400 p-3"
      />
    </div>
  );
}

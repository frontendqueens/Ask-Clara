export type InputChoice = "message" | "screenshot";

type InputChoicesProps = {
  value: InputChoice;
  onChange: (value: InputChoice) => void;
};

export function InputChoices({ value, onChange }: InputChoicesProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="font-semibold">How do you want to share the message?</legend>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="input-message"
            name="input-type"
            value="message"
            checked={value === "message"}
            onChange={() => onChange("message")}
          />
          <label htmlFor="input-message">Type or paste the message</label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="input-screenshot"
            name="input-type"
            value="screenshot"
            checked={value === "screenshot"}
            onChange={() => onChange("screenshot")}
          />
          <label htmlFor="input-screenshot">Upload a screenshot</label>
        </div>
      </div>
    </fieldset>
  );
}

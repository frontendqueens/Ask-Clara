import { Camera, ClipboardPaste, MessageCircle } from "lucide-react";

export type InputChoice = "message" | "screenshot" | "tell";

type InputChoicesProps = {
  value: InputChoice;
  onChange: (value: InputChoice) => void;
};

const CHOICES: {
  value: InputChoice;
  label: string;
  hint: string;
  Icon: typeof ClipboardPaste;
}[] = [
  {
    value: "message",
    label: "Paste a message",
    hint: "Copy the text you received and paste it here.",
    Icon: ClipboardPaste,
  },
  {
    value: "screenshot",
    label: "Use a screenshot",
    hint: "Add a picture of the message instead.",
    Icon: Camera,
  },
  {
    value: "tell",
    label: "Tell Clara",
    hint: "Describe what happened in your own words.",
    Icon: MessageCircle,
  },
];

export function InputChoices({ value, onChange }: InputChoicesProps) {
  return (
    <fieldset className="clara-fieldset">
      <legend className="clara-legend">
        How would you like to show Clara?
      </legend>
      {/* Native radios keep arrow-key navigation and label wiring intact. */}
      <div className="clara-choices">
        {CHOICES.map((choice) => {
          const selected = value === choice.value;

          return (
            <label key={choice.value} className="clara-choice">
              <input
                className="clara-choice__input"
                type="radio"
                name="input-type"
                value={choice.value}
                checked={selected}
                onChange={() => onChange(choice.value)}
              />
              <span aria-hidden="true" className="clara-choice__icon">
                <choice.Icon size={20} />
              </span>
              <span className="clara-choice__label">{choice.label}</span>
              <span className="clara-choice__check">{choice.hint}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

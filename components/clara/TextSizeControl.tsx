export type TextSize = "small" | "medium" | "large";

type TextSizeControlProps = {
  value: TextSize;
  onChange: (value: TextSize) => void;
};

const OPTIONS: { value: TextSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export function TextSizeControl({ value, onChange }: TextSizeControlProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-semibold">Text size</legend>
      <div className="flex flex-wrap gap-4">
        {OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <input
              type="radio"
              id={`text-size-${option.value}`}
              name="text-size"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <label htmlFor={`text-size-${option.value}`}>{option.label}</label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

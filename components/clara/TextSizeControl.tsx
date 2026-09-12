export type TextSize = "small" | "medium" | "large";

type TextSizeControlProps = {
  value: TextSize;
  onChange: (value: TextSize) => void;
};

/**
 * The "Aa Larger text" porch-light control. It is a two-state toggle so the
 * reading size is one predictable press away, and it reports state with
 * aria-pressed rather than relying on the highlight colour alone.
 */
export function TextSizeControl({ value, onChange }: TextSizeControlProps) {
  const enlarged = value === "large";

  return (
    <button
      type="button"
      className="clara-nav__toggle"
      aria-pressed={enlarged}
      onClick={() => onChange(enlarged ? "medium" : "large")}
    >
      <span aria-hidden="true" className="clara-nav__toggle-aa">
        Aa
      </span>
      Larger text
    </button>
  );
}

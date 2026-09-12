"use client";

import { useEffect, useState } from "react";
import { TextSizeControl, type TextSize } from "./TextSizeControl";

export function SiteHeader() {
  const [textSize, setTextSize] = useState<TextSize>("medium");

  // Scaling the root font size keeps every rem-based size in proportion, so
  // larger text behaves the same way as browser zoom.
  useEffect(() => {
    const root = document.documentElement;

    if (textSize === "large") {
      root.dataset.claraText = "large";
    } else {
      delete root.dataset.claraText;
    }
  }, [textSize]);

  return (
    <header className="clara-header">
      <div className="clara-identity">
        <span aria-hidden="true" className="clara-mark">
          C
        </span>
        <div>
          <h1 className="clara-identity__name">Ask Clara</h1>
          <p className="clara-identity__tagline">A calm second opinion</p>
        </div>
      </div>
      <nav className="clara-nav" aria-label="Ask Clara">
        <a className="clara-nav__link" href="#ask-clara">
          Ask Clara
        </a>
        <a className="clara-nav__link" href="#how-it-works">
          How it works
        </a>
        <TextSizeControl value={textSize} onChange={setTextSize} />
      </nav>
    </header>
  );
}

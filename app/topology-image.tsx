"use client";

import { useEffect, useState } from "react";

export default function TopologyImage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="topology-thumb"
        onClick={() => setOpen(true)}
        aria-label="Zvětšit návrh topologie"
      >
        <img src="/navrh.jpg" alt="Návrh topologie sítě" />
        <span className="topology-hint">Kliknutím zvětšit</span>
      </button>

      {open && (
        <div
          className="lightbox"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setOpen(false)}
            aria-label="Zavřít"
          >
            ×
          </button>
          <img
            src="/navrh.jpg"
            alt="Návrh topologie sítě"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

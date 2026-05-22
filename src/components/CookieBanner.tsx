"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between gap-6">
        <p className="text-xs text-zinc-400 leading-relaxed">
          This site uses cookies for authentication (via Clerk) and stores your writing submissions to track your progress. No third-party tracking or advertising.{" "}
          <a href="/privacy" className="underline hover:text-zinc-200 transition-colors">Privacy policy</a>
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

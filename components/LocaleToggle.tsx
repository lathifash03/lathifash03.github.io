"use client";

import { useCallback, useRef } from "react";
import type { Locale, Ui } from "@/lib/content";

/** Roughly the sticky header's height: what sits under it is what is being read. */
const TOP_BAND = 96;

/**
 * The section occupying the top of the viewport. A language switch is a full
 * page load, so the section is carried across as a hash (CLAUDE.md, Routes).
 */
function currentSection(): string | null {
  let current: string | null = null;
  for (const section of document.querySelectorAll<HTMLElement>(
    "main section[id]",
  )) {
    if (section.getBoundingClientRect().top <= TOP_BAND) current = section.id;
  }
  return current;
}

/**
 * DESIGN.md §4: EN/ID at the far right of the nav. The current language is not
 * a link; the other one is. Rendered only when that other locale is complete,
 * so there is never a placeholder or a disabled control.
 */
export function LocaleToggle({
  locale,
  target,
  targetPath,
  ui,
  keepSection = false,
}: {
  locale: Locale;
  target: Locale;
  targetPath: string;
  ui: Ui;
  keepSection?: boolean;
}) {
  const here = ui.locales[locale];
  const there = ui.locales[target];
  const link = useRef<HTMLAnchorElement>(null);

  const syncHref = useCallback(() => {
    if (!keepSection || !link.current) return;
    const id = currentSection();
    link.current.setAttribute(
      "href",
      id ? `${targetPath}#${id}` : targetPath,
    );
  }, [keepSection, targetPath]);

  return (
    <nav
      aria-label={ui.nav.language}
      className="flex items-center gap-1.5 font-mono text-meta"
    >
      <span aria-current="true" className="text-ink">
        {here.short}
      </span>
      <span aria-hidden="true" className="text-line">
        /
      </span>
      <a
        ref={link}
        href={targetPath}
        hrefLang={target}
        lang={target}
        // WCAG 2.5.3: the accessible name has to contain the visible text, so a
        // voice-control user can say what they see. "ID" alone says little, so
        // the full name follows it rather than replacing it.
        aria-label={`${there.short} — ${there.name}`}
        className="text-ink-2 transition-colors duration-200 hover:text-ink"
        // The section is written into the href just before the browser follows
        // it, rather than navigating in script: the link keeps working with no
        // JS, and middle-click and "open in new tab" get the same destination.
        onPointerDown={syncHref}
        onFocus={syncHref}
        onKeyDown={syncHref}
      >
        {there.short}
      </a>
    </nav>
  );
}

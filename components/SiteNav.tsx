"use client";

import { useEffect, useRef, useState } from "react";
import { LocaleToggle } from "@/components/LocaleToggle";
import { Container } from "@/components/ui/Section";
import type { Locale, Ui } from "@/lib/content";

type Tab = { id: string; label: string; sections: string[] };

/** Decision F: Work covers the three lanes through the end of the Data section. */
function tabsFrom(ui: Ui): Tab[] {
  return [
    { id: "lanes", label: ui.nav.work, sections: ["lanes", "research", "built", "data"] },
    { id: "experience", label: ui.nav.experience, sections: ["experience"] },
    { id: "leadership", label: ui.nav.leadership, sections: ["leadership"] },
    { id: "writing", label: ui.nav.writing, sections: ["writing"] },
    { id: "contact", label: ui.nav.contact, sections: ["contact"] },
  ];
}

export function SiteNav({
  name,
  ui,
  locale,
  otherLocale,
  otherPath,
}: {
  name: string;
  ui: Ui;
  locale: Locale;
  /** null when that locale is incomplete: the slot then renders nothing at all. */
  otherLocale: Locale | null;
  otherPath: string | null;
}) {
  const tabs = tabsFrom(ui);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = tabs.flatMap((tab) => tab.sections);
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        // The section highest up the document wins, so the hero clears every tab.
        const current = ids.find((id) => visible.has(id)) ?? null;
        setActive(current);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.01, 0.5] },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      // Escape must hand focus back to the control that opened the sheet;
      // otherwise it falls to <body> and the reader tabs from the top again.
      menuButton.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const activeTab = tabs.find((tab) => active && tab.sections.includes(active));

  return (
    <header
      // Translucent only at rest, where the hero behind it is paper anyway.
      // Once the page scrolls, a dark section can pass underneath and 85%
      // paper over ink drops the inactive tabs to 4.23:1, so the bar goes
      // solid at the same moment it gains its border (DESIGN.md §4).
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled ? "border-b border-line bg-paper" : "bg-paper/85"
      }`}
    >
      <Container>
        <nav
          aria-label={ui.nav.work}
          className="flex h-16 items-center justify-between gap-6 md:h-20"
        >
          <a href="#hero" className="text-[1.0625rem] text-ink">
            {name}
          </a>

          <div className="flex items-center gap-6 md:gap-8">
            <ul className="hidden items-center gap-8 md:flex">
              {tabs.map((tab) => {
                const isActive = activeTab?.id === tab.id;
                return (
                  <li key={tab.id}>
                    <a
                      href={`#${tab.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative block py-2 text-[0.9375rem] transition-colors duration-200 ${
                        isActive ? "text-ink" : "text-ink-2 hover:text-ink"
                      }`}
                    >
                      {tab.label}
                      {/* Decision G: every active-tab underline is --ink. */}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 -bottom-0.5 h-0.5 bg-ink ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            {otherLocale && otherPath ? (
              <LocaleToggle
                locale={locale}
                target={otherLocale}
                targetPath={otherPath}
                ui={ui}
                keepSection
              />
            ) : null}

            <button
              ref={menuButton}
              type="button"
              className="text-[0.9375rem] text-ink md:hidden"
              aria-expanded={menuOpen}
              aria-controls="nav-sheet"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? ui.nav.close : ui.nav.menu}
            </button>
          </div>
        </nav>
      </Container>

      {menuOpen ? (
        <div id="nav-sheet" className="border-t border-line bg-paper md:hidden">
          <Container>
            <ul className="py-4">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <a
                    href={`#${tab.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-[1.0625rem] text-ink"
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      ) : null}
    </header>
  );
}

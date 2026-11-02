import type { Profile, Ui } from "@/lib/content";

type IconName = "github" | "linkedin" | "medium" | "linktree" | "email";

/**
 * Simple marks drawn as paths rather than pulled from an icon package: five
 * glyphs do not earn a dependency (CLAUDE.md, Working style). Most are solid
 * shapes; the Linktree mark is a drawn stem and branches, so it is stroked.
 */
const paths: Record<IconName, { d: string[]; stroke?: true }> = {
  github: {
    d: [
      "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z",
    ],
  },
  linkedin: {
    d: [
      "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.76-1.95C20.7 8.69 22 10.9 22 14.3V21h-4v-5.95c0-1.42-.03-3.25-2.06-3.25-2.06 0-2.38 1.55-2.38 3.15V21H9V9Z",
    ],
  },
  medium: {
    d: [
      "M4.3 7.2c.02-.2-.06-.4-.2-.53L2.6 4.86v-.26h4.6l3.56 7.8 3.13-7.8h4.38v.26l-1.28 1.23a.37.37 0 0 0-.14.36v9.1c-.02.14.04.28.14.36l1.25 1.23v.26h-6.3v-.26l1.3-1.26c.12-.13.12-.17.12-.36V8.9l-3.6 9.17h-.49L4.68 8.9v6.15c-.04.25.05.5.22.68l1.69 2.05v.26H1.8v-.26l1.69-2.05c.17-.18.25-.43.21-.68V7.2Z",
    ],
  },
  linktree: {
    stroke: true,
    d: ["M12 21v-8.4", "M12 12.6 6.9 7.5", "M12 12.6l5.1-5.1", "M5.8 12.6h12.4"],
  },
  email: {
    d: [
      "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-8 5.2-8-5.2ZM19.6 7H4.4l7.6 4.9L19.6 7Z",
    ],
  },
};

/** DESIGN.md §4, "Contact band": the ring and the hover ground invert on ink. */
const ring = {
  light: "border-line text-ink hover:bg-surface-2",
  dark: "border-paper/30 text-paper hover:bg-paper/10",
};

function Social({
  href,
  label,
  icon,
  onDark,
}: {
  href: string;
  label: string;
  icon: IconName;
  onDark?: boolean;
}) {
  const glyph = paths[icon];
  return (
    <li>
      <a
        href={href}
        aria-label={label}
        className={`flex size-11 items-center justify-center rounded-full border transition-colors duration-200 ${
          onDark ? ring.dark : ring.light
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-[18px]"
          {...(glyph.stroke
            ? {
                fill: "none",
                stroke: "currentColor",
                strokeWidth: 1.8,
                strokeLinecap: "round" as const,
              }
            : { fill: "currentColor" })}
        >
          {glyph.d.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      </a>
    </li>
  );
}

/**
 * DESIGN.md §4: 44px circles, in the hero under the CTAs and again at the foot
 * of the Contact band. Each is icon-only, so its accessible name comes from
 * ui.json (CLAUDE.md hard rule 6) and the glyph is hidden from the
 * accessibility tree.
 *
 * The two rows carry different sets: the hero offers a way to write (email),
 * the contact band already has the address in full and offers Medium instead.
 */
export function SocialLinks({
  profile,
  ui,
  set = "hero",
  onDark,
}: {
  profile: Profile;
  ui: Ui;
  set?: "hero" | "contact";
  onDark?: boolean;
}) {
  const { contact } = profile;
  const items: { href: string; label: string; icon: IconName }[] = [
    { href: contact.github, label: ui.labels.github, icon: "github" },
    { href: contact.linkedin, label: ui.labels.linkedin, icon: "linkedin" },
    ...(set === "contact"
      ? [{ href: contact.medium, label: ui.labels.medium, icon: "medium" as const }]
      : []),
    { href: contact.linktree, label: ui.labels.linktree, icon: "linktree" },
    ...(set === "hero"
      ? [
          {
            href: `mailto:${contact.email}`,
            label: ui.labels.emailMe,
            icon: "email" as const,
          },
        ]
      : []),
  ];

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <Social key={item.icon} {...item} onDark={onDark} />
      ))}
    </ul>
  );
}

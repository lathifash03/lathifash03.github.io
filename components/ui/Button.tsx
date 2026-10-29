import type { ReactNode } from "react";

/** DESIGN.md §4: pill, 48px, ink fill or 1px line border. */
const base =
  "inline-flex h-12 items-center gap-2 rounded-full px-6 text-[0.9375rem] transition-colors duration-200";

export const buttonStyles = {
  primary: `${base} bg-ink text-paper hover:bg-ink/90`,
  secondary: `${base} border border-line text-ink hover:bg-surface-2`,
};

export function LinkButton({
  href,
  variant = "secondary",
  children,
  download,
}: {
  href: string;
  variant?: keyof typeof buttonStyles;
  children: ReactNode;
  download?: boolean;
}) {
  return (
    <a href={href} download={download} className={`group ${buttonStyles[variant]}`}>
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-[3px]"
      >
        →
      </span>
    </a>
  );
}

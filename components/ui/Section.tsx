import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-6 md:px-12 ${className}`}>
      {children}
    </div>
  );
}

/**
 * A numbered main section — DESIGN.md §3, §4, §5. The index sits in the first
 * grid column so the heading never repeats it, and both stay on `--paper`
 * above the container: the page reads as titled white cards laid on paper.
 *
 * `tone` picks the container's ground. "dark" is the Contact band, the only
 * section that inverts (DESIGN.md §4, "Contact band"); `data-dark` is what
 * switches the focus ring to a light one in globals.css.
 */
export function Section({
  id,
  index,
  title,
  tone = "white",
  children,
}: {
  id: string;
  index?: string;
  title: string;
  tone?: "white" | "dark";
  children: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-20 py-12 md:py-16"
    >
      <Container>
        <div data-reveal className="grid gap-x-8 gap-y-3 px-1 md:grid-cols-12 md:px-2">
          {index ? (
            <p
              aria-hidden="true"
              className="font-mono text-meta text-ink-2 md:col-span-2 md:pt-3"
            >
              {index}
            </p>
          ) : null}
          <h2
            id={`${id}-title`}
            className={`text-section text-ink ${index ? "md:col-span-10" : "md:col-span-12"}`}
          >
            {title}
          </h2>
        </div>
        <div
          {...(dark ? { "data-dark": "" } : {})}
          className={`mt-8 rounded-panel p-6 md:mt-10 md:p-12 ${
            dark ? "bg-ink text-paper" : "border border-line bg-white"
          }`}
        >
          {children}
        </div>
      </Container>
    </section>
  );
}

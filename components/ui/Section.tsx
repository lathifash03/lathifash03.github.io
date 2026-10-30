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
 * A numbered main section — DESIGN.md §3, §5. The index sits in the first grid
 * column so the heading never repeats it.
 */
export function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-20 py-20 md:py-32"
    >
      <Container>
        <div data-reveal className="grid gap-x-8 gap-y-3 md:grid-cols-12">
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
        <div className="mt-12 md:mt-16">{children}</div>
      </Container>
    </section>
  );
}

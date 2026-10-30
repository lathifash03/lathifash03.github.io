import type { CSSProperties } from "react";
import { LocalClock } from "@/components/LocalClock";
import { Picture } from "@/components/ui/Picture";
import { Container } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import type { Profile, Ui } from "@/lib/content";

const traceMark: Record<string, { mark: string; className: string }> = {
  pass: { mark: "✓", className: "text-lane-sw" },
  fail: { mark: "✗", className: "text-lane-wr" },
  retry: { mark: "↻", className: "text-lane-ai" },
  done: { mark: "✓", className: "text-ink" },
};

/**
 * DESIGN.md §7.3. The lines arrive one by one, in file order, and the card
 * never adds, edits or reorders their text. The caption stays put throughout.
 */
function VerifyTrace({ profile, ui }: { profile: Profile; ui: Ui }) {
  return (
    <figure className="rounded-card bg-surface p-6 md:p-8">
      <ul className="space-y-2">
        {profile.heroTrace.map((line, i) => {
          const { mark, className } = traceMark[line.status];
          return (
            <li
              key={line.text}
              className="trace-line flex gap-3 font-mono text-meta"
              style={{ "--i": i } as CSSProperties}
            >
              <span aria-hidden="true" className={className}>
                {mark}
              </span>
              <span className="text-ink">{line.text}</span>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-6 text-meta text-ink-2">
        {ui.labels.illustration}
      </figcaption>
    </figure>
  );
}

export function Hero({ profile, ui }: { profile: Profile; ui: Ui }) {
  return (
    <section id="hero" className="pt-28 pb-20 md:pt-40 md:pb-32">
      <Container>
        <div className="grid items-start gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p
              className="hero-rise flex items-center gap-2.5 font-mono text-meta text-ink-2"
              style={{ "--i": 0 } as CSSProperties}
            >
              <span
                aria-hidden="true"
                className="inline-block size-2 rounded-full bg-lane-sw"
              />
              {profile.status}
            </p>

            <h1
              className="hero-rise mt-6 text-hero-name text-ink"
              style={{ "--i": 1 } as CSSProperties}
            >
              {profile.name}
            </h1>

            <p
              className="hero-rise mt-8 max-w-[68ch] text-hero-statement text-ink"
              style={{ "--i": 2 } as CSSProperties}
            >
              {profile.statement}
            </p>

            <div
              className="hero-rise mt-10 flex flex-wrap items-center gap-3"
              style={{ "--i": 3 } as CSSProperties}
            >
              <LinkButton href={profile.contact.cv} variant="primary">
                {ui.actions.downloadCv}
              </LinkButton>
              <LinkButton href={`mailto:${profile.contact.email}`}>
                {ui.actions.email}
              </LinkButton>
            </div>

            <div
              className="hero-rise mt-8"
              style={{ "--i": 4 } as CSSProperties}
            >
              <LocalClock
                label={profile.location.label}
                timeZone={profile.location.timezone}
                ariaLabel={ui.labels.clock}
              />
            </div>
          </div>

          <div
            className="hero-rise space-y-6 lg:col-span-5"
            style={{ "--i": 1 } as CSSProperties}
          >
            {profile.photo ? (
              <Picture
                asset={profile.photo}
                priority
                className="aspect-[4/5] w-full rounded-image bg-surface-2 object-cover"
              />
            ) : null}
            <VerifyTrace profile={profile} ui={ui} />
          </div>
        </div>
      </Container>
    </section>
  );
}

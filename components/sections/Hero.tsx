import type { CSSProperties } from "react";
import { LocalClock } from "@/components/LocalClock";
import { Picture } from "@/components/ui/Picture";
import { Container } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Profile, Ui } from "@/lib/content";

/** DESIGN.md §2: the three status colours exist only on this dark card. */
const traceMark: Record<string, { mark: string; className: string }> = {
  pass: { mark: "✓", className: "text-trace-pass" },
  fail: { mark: "✗", className: "text-trace-fail" },
  retry: { mark: "↻", className: "text-trace-retry" },
  done: { mark: "✓", className: "text-trace-pass" },
};

/**
 * DESIGN.md §7.3. The lines arrive one by one, in file order, and the card
 * never adds, edits or reorders their text. The 2deg tilt is layout, not
 * motion, so it stays under prefers-reduced-motion. The caption sits under the
 * card, on paper, and is always visible.
 */
function VerifyTrace({ profile, ui }: { profile: Profile; ui: Ui }) {
  return (
    <figure>
      <div
        data-dark
        className="rotate-2 rounded-card bg-ink p-6 text-paper md:p-7"
      >
        <p className="font-mono text-meta text-paper/60">
          {ui.labels.traceHeader}
        </p>
        <hr className="mt-4 border-paper/15" />
        <ul className="mt-4 space-y-2.5">
          {profile.heroTrace.map((line, i) => {
            const { mark, className } = traceMark[line.status];
            return (
              <li
                key={line.text}
                // Baseline-aligned, and the threshold sits straight after the
                // value rather than out at the right edge: the card is tilted,
                // so anything far from its value drifts a line's worth away
                // from it down the slope.
                className="trace-line flex items-baseline gap-x-3 font-mono text-meta"
                style={{ "--i": i } as CSSProperties}
              >
                <span aria-hidden="true" className={className}>
                  {mark}
                </span>
                <span className="text-paper">{line.text}</span>
                {line.threshold ? (
                  <span className="text-paper/55">{line.threshold}</span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption className="mt-5 text-meta text-ink-2">
        {ui.labels.illustration}
      </figcaption>
    </figure>
  );
}

/**
 * DESIGN.md §4: a small tilted tile holding the cut-out portrait, inline with
 * the name. It is the only portrait on the page.
 */
function PortraitTile({ profile }: { profile: Profile }) {
  if (!profile.photo) return null;
  return (
    // shrink-0: the tile shares a flex row with the name, and the name's
    // min-content width would otherwise squeeze the tile out of square and
    // crop the portrait off-centre.
    <span className="inline-block shrink-0 -rotate-[5deg] rounded-[24px] border-[3px] border-white bg-tile shadow-tile">
      <Picture
        asset={profile.photo}
        priority
        className="size-[72px] rounded-[21px] object-cover object-top md:size-24"
      />
    </span>
  );
}

export function Hero({ profile, ui }: { profile: Profile; ui: Ui }) {
  return (
    <section id="hero" className="pt-28 pb-12 md:pt-40 md:pb-16">
      <Container>
        <div className="grid items-start gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* Pill sits top-right of the hero block on desktop, above the
                name on a phone, so it never crowds the portrait tile. */}
            <div
              className="hero-rise flex md:justify-end"
              style={{ "--i": 0 } as CSSProperties}
            >
              <p className="inline-flex items-center gap-2.5 rounded-full border border-lane-sw-strong/20 bg-lane-sw-tint px-4 py-1.5 font-mono text-meta text-lane-sw-strong">
                <span
                  aria-hidden="true"
                  className="inline-block size-2 rounded-full bg-lane-sw"
                />
                {profile.status}
              </p>
            </div>

            <div
              className="hero-rise mt-6 flex items-center gap-5"
              style={{ "--i": 1 } as CSSProperties}
            >
              <PortraitTile profile={profile} />
              <h1 className="text-hero-name text-ink">{profile.name}</h1>
            </div>

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

            {/* Socials and the clock share one row, split by a hairline. The
                rule is hidden once the row wraps, where it would dangle. */}
            <div
              className="hero-rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
              style={{ "--i": 4 } as CSSProperties}
            >
              <SocialLinks profile={profile} ui={ui} />
              <span
                aria-hidden="true"
                className="hidden h-8 w-px bg-line sm:block"
              />
              <LocalClock
                label={profile.location.label}
                timeZone={profile.location.timezone}
                ariaLabel={ui.labels.clock}
              />
            </div>
          </div>

          <div
            className="hero-rise lg:col-span-5 lg:pt-10"
            style={{ "--i": 2 } as CSSProperties}
          >
            <VerifyTrace profile={profile} ui={ui} />
          </div>
        </div>
      </Container>
    </section>
  );
}

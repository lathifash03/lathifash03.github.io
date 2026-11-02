import {
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  Instrument_Sans,
} from "next/font/google";

/**
 * DESIGN.md §3. Both sans faces are variable, so no `weight` is listed: the
 * whole range ships in one file and the stylesheet asks for 500 or 600 where
 * it wants them. Bricolage also carries an optical-size axis, which is the
 * reason it is the display face — the hero name and a card title are set from
 * the same family but not the same drawing.
 */
// Named for the face, not the role: Tailwind's own `--font-display` token is
// the role, and it points here. Two variables with one name would collide.
const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

/** Shared by every root layout, so both locales load one copy of each font. */
export const fontVariables = `${display.variable} ${sans.variable} ${plexMono.variable}`;

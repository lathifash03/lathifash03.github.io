import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

/** Shared by every root layout, so both locales load one copy of each font. */
export const fontVariables = `${jakarta.variable} ${plexMono.variable}`;

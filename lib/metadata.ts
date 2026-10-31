import type { Metadata } from "next";
import {
  getCaseStudy,
  getProfile,
  getProjectForCaseStudy,
  hasCompleteLocale,
  localePath,
  otherLocale,
  type Locale,
} from "./content";

// GitHub Pages serves the site from the repo root, so Open Graph URLs resolve
// against this origin (CLAUDE.md, Stack).
export const siteUrl = "https://lathifash03.github.io";

const icons = {
  icon: [
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon.png", type: "image/png", sizes: "32x32" },
  ],
};

/**
 * Each page points at its counterpart, and only while that counterpart exists:
 * an incomplete locale is not advertised (CLAUDE.md, Routes).
 */
function languages(locale: Locale, path: string): Record<string, string> | undefined {
  const other = otherLocale(locale);
  if (!hasCompleteLocale(other)) return undefined;
  return {
    [locale]: localePath(locale, path),
    [other]: localePath(other, path),
  };
}

/**
 * Open Graph expects language_TERRITORY, not a bare language tag. The English
 * copy is written in British spelling, so en_GB.
 */
const ogLocale: Record<Locale, string> = { en: "en_GB", id: "id_ID" };

/**
 * The shared card, drawn per locale by scripts/make-og.mjs from that locale's
 * profile. Every page carries one: a link posted anywhere gets the name and the
 * statement rather than a blank rectangle.
 */
function ogImage(locale: Locale) {
  return [
    {
      url: `/og/${locale}.png`,
      width: 1200,
      height: 630,
      alt: getProfile(locale).name,
    },
  ];
}

/** Metadata for a locale's root layout. */
export function siteMetadata(locale: Locale): Metadata {
  const profile = getProfile(locale);
  const path = localePath(locale, "/");

  return {
    metadataBase: new URL(siteUrl),
    title: profile.name,
    description: profile.statement,
    icons,
    alternates: { canonical: path, languages: languages(locale, "/") },
    openGraph: {
      type: "website",
      locale: ogLocale[locale],
      title: profile.name,
      description: profile.statement,
      url: path,
      siteName: profile.name,
      images: ogImage(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: profile.name,
      description: profile.statement,
      images: ogImage(locale),
    },
  };
}

export function caseStudyMetadata(locale: Locale, slug: string): Metadata {
  const study = getCaseStudy(locale, slug);
  const profile = getProfile(locale);
  const project = getProjectForCaseStudy(locale, slug);
  const description = project?.summary ?? study.context;
  const route = `/projects/${slug}/`;
  const path = localePath(locale, route);

  // A case study leads with its own picture where it has one, and falls back to
  // the site card: Next replaces openGraph per segment rather than merging it,
  // so the fallback has to be named here too.
  const images = project?.image
    ? [{ url: project.image.src, alt: project.image.alt }]
    : ogImage(locale);

  return {
    title: `${study.title} — ${profile.name}`,
    description,
    alternates: { canonical: path, languages: languages(locale, route) },
    openGraph: {
      type: "article",
      locale: ogLocale[locale],
      title: study.title,
      description,
      url: path,
      siteName: profile.name,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description,
      images,
    },
  };
}

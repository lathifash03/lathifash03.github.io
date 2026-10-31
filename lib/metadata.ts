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
const siteUrl = "https://lathifash03.github.io";

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
      title: profile.name,
      description: profile.statement,
      url: path,
      siteName: profile.name,
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

  return {
    title: `${study.title} — ${profile.name}`,
    description,
    alternates: { canonical: path, languages: languages(locale, route) },
    openGraph: {
      type: "article",
      title: study.title,
      description,
      url: path,
      siteName: profile.name,
      images: project?.image
        ? [{ url: project.image.src, alt: project.image.alt }]
        : undefined,
    },
  };
}

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  caseStudySchema,
  experienceSchema,
  leadershipSchema,
  profileSchema,
  projectsSchema,
  uiSchema,
  writingSchema,
  type CaseStudy,
  type ExperienceItem,
  type Leadership,
  type Profile,
  type Project,
  type ProjectGroup,
  type Ui,
  type Writing,
} from "./schema";

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const CONTENT_ROOT = join(process.cwd(), "content");

function localeDir(locale: Locale): string {
  return join(CONTENT_ROOT, locale);
}

/** Keys starting with `_` are editor notes, not content (same rule as scripts/check-tbd.mjs). */
function stripNotes(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripNotes);
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      if (key.startsWith("_")) continue;
      out[key] = stripNotes(v);
    }
    return out;
  }
  return value;
}

function isDraft(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    (value as { draft?: unknown }).draft === true
  );
}

/**
 * Drafts never reach the build (CLAUDE.md hard rule 5):
 * a draft item is dropped from its array, and a draft nested object
 * omits only that field, so the component falls back to a layout without it.
 */
function pruneDrafts<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.filter((item) => !isDraft(item)).map(pruneDrafts) as T;
  }
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      if (isDraft(v)) continue;
      out[key] = pruneDrafts(v);
    }
    return out as T;
  }
  return value;
}

const cache = new Map<string, unknown>();

function readJson<T>(locale: Locale, file: string, schema: z.ZodType<T>): T {
  const key = `${locale}/${file}`;
  if (cache.has(key)) return cache.get(key) as T;

  const path = join(localeDir(locale), file);
  const parsed = schema.safeParse(
    stripNotes(JSON.parse(readFileSync(path, "utf8"))),
  );
  if (!parsed.success) {
    throw new Error(
      `content/${locale}/${file} does not match its schema:\n${z.prettifyError(parsed.error)}`,
    );
  }

  const value = pruneDrafts(parsed.data);
  cache.set(key, value);
  return value;
}

export function getProfile(locale: Locale): Profile {
  return readJson(locale, "profile.json", profileSchema);
}

export function getUi(locale: Locale): Ui {
  return readJson(locale, "ui.json", uiSchema);
}

function loadProjects(locale: Locale): Project[] {
  return [...readJson(locale, "projects.json", projectsSchema).projects].sort(
    (a, b) => a.order - b.order,
  );
}

export function getProjects(locale: Locale): Project[] {
  verifyCaseStudyLinks(locale);
  return loadProjects(locale);
}

export function getProjectsByGroup(
  locale: Locale,
  group: ProjectGroup,
): Project[] {
  return getProjects(locale).filter((project) => project.group === group);
}

export function getExperience(locale: Locale): ExperienceItem[] {
  return readJson(locale, "experience.json", experienceSchema).experience;
}

export function getLeadership(locale: Locale): Leadership {
  return readJson(locale, "leadership.json", leadershipSchema);
}

export function getWriting(locale: Locale): Writing {
  return readJson(locale, "writing.json", writingSchema);
}

function caseStudyDir(locale: Locale): string {
  return join(localeDir(locale), "case-studies");
}

function loadCaseStudies(locale: Locale): CaseStudy[] {
  const key = `${locale}/case-studies`;
  if (cache.has(key)) return cache.get(key) as CaseStudy[];

  const dir = caseStudyDir(locale);
  const files = existsSync(dir)
    ? readdirSync(dir).filter((name) => name.endsWith(".md"))
    : [];

  const studies: CaseStudy[] = [];
  for (const file of files) {
    const { data, content } = matter(readFileSync(join(dir, file), "utf8"));
    const parsed = caseStudySchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `content/${locale}/case-studies/${file} frontmatter does not match its schema:\n${z.prettifyError(parsed.error)}`,
      );
    }
    if (parsed.data.draft) continue;
    if (parsed.data.slug !== file.replace(/\.md$/, "")) {
      throw new Error(
        `content/${locale}/case-studies/${file}: frontmatter slug "${parsed.data.slug}" does not match the file name`,
      );
    }
    studies.push({ ...parsed.data, body: content.trim() });
  }

  studies.sort((a, b) => a.slug.localeCompare(b.slug));
  cache.set(key, studies);
  return studies;
}

export function getCaseStudies(locale: Locale): CaseStudy[] {
  verifyCaseStudyLinks(locale);
  return loadCaseStudies(locale);
}

export function getCaseStudy(locale: Locale, slug: string): CaseStudy {
  const study = getCaseStudies(locale).find((item) => item.slug === slug);
  if (!study) {
    throw new Error(`No case study for slug "${slug}" in content/${locale}/case-studies/`);
  }
  return study;
}

function routeToSlug(route: string): string {
  return route.replace(/^\/projects\//, "").replace(/\/$/, "");
}

const verifiedLocales = new Set<Locale>();

/**
 * content/<locale>/case-studies/ is the source of truth (CLAUDE.md, Content files):
 * every case-study link must resolve to a file there, and every file must be linked.
 * Throwing here fails the build.
 */
function verifyCaseStudyLinks(locale: Locale): void {
  if (verifiedLocales.has(locale)) return;
  verifiedLocales.add(locale);

  const published = new Set(loadCaseStudies(locale).map((study) => study.slug));
  const linked = new Map<string, string>();

  for (const project of loadProjects(locale)) {
    if (project.links.caseStudy) {
      linked.set(routeToSlug(project.links.caseStudy), `projects.json (${project.slug})`);
    }
  }
  for (const item of readJson(locale, "experience.json", experienceSchema)
    .experience) {
    if (item.caseStudy) {
      linked.set(routeToSlug(item.caseStudy), `experience.json (${item.id})`);
    }
  }

  const problems: string[] = [];
  for (const [slug, source] of linked) {
    if (!published.has(slug)) {
      problems.push(
        `${source} links to /projects/${slug}/ but content/${locale}/case-studies/${slug}.md does not exist (or is a draft)`,
      );
    }
  }
  for (const slug of published) {
    if (!linked.has(slug)) {
      problems.push(
        `content/${locale}/case-studies/${slug}.md is published but nothing links to /projects/${slug}/`,
      );
    }
  }
  if (problems.length) {
    throw new Error(`Case-study links disagree with content/${locale}/case-studies/:\n- ${problems.join("\n- ")}`);
  }
}

function listContentFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(json|md)$/.test(name)) out.push(relative(root, path));
    }
  };
  walk(root);
  return out.sort();
}

/**
 * The /id/ route and the EN/ID toggle only exist once every English file has a
 * translation (CLAUDE.md, Routes). Until then the toggle slot renders nothing.
 */
export function hasCompleteLocale(locale: Locale): boolean {
  if (locale === defaultLocale) return true;
  if (!existsSync(localeDir(locale))) return false;
  const translated = new Set(listContentFiles(localeDir(locale)));
  return listContentFiles(localeDir(defaultLocale)).every((file) =>
    translated.has(file),
  );
}

export function availableLocales(): Locale[] {
  return locales.filter(hasCompleteLocale);
}

export * from "./schema";

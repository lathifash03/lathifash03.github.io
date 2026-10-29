import { z } from "zod";

/** Portfolio lanes — DESIGN.md §2. */
export const laneId = z.enum(["ai", "sw", "wr"]);

/**
 * `draft: true` on a nested object omits that field only (CLAUDE.md, Content files),
 * so every draftable field is optional in the schema: after pruning it is gone.
 */
const draftable = { draft: z.boolean().optional() };

const asset = z
  .object({
    src: z.string().startsWith("/"),
    alt: z.string(),
    ...draftable,
  })
  .strict();

const galleryAsset = asset.extend({ caption: z.string() }).strict();

/** A case-study route: `/projects/<slug>/`. */
const caseStudyRoute = z.string().regex(/^\/projects\/[a-z0-9-]+\/$/);

export const profileSchema = z
  .object({
    name: z.string(),
    shortName: z.string(),
    photo: asset.optional(),
    status: z.string(),
    statement: z.string(),
    location: z.object({ label: z.string(), timezone: z.string() }).strict(),
    greetings: z
      .array(
        z
          .object({
            text: z.string(),
            lang: z.string(),
            dir: z.enum(["ltr", "rtl"]).optional(),
          })
          .strict(),
      )
      .min(1),
    heroTrace: z
      .array(
        z
          .object({
            text: z.string(),
            status: z.enum(["pass", "fail", "retry", "done"]),
          })
          .strict(),
      )
      .min(1),
    lanes: z
      .array(
        z.object({ id: laneId, title: z.string(), summary: z.string() }).strict(),
      )
      .min(1),
    education: z
      .object({
        school: z.string(),
        degree: z.string(),
        period: z.string(),
        gpa: z.string(),
        scholarship: z.string(),
        thesis: z.string(),
      })
      .strict(),
    languages: z.array(z.string()),
    skills: z.record(z.string(), z.array(z.string())),
    contact: z
      .object({
        email: z.email(),
        github: z.url(),
        linkedin: z.url(),
        cv: z.string().startsWith("/"),
        closing: z.string(),
      })
      .strict(),
  })
  .strict();

export const uiSchema = z
  .object({
    nav: z
      .object({
        work: z.string(),
        experience: z.string(),
        leadership: z.string(),
        writing: z.string(),
        contact: z.string(),
        menu: z.string(),
        close: z.string(),
      })
      .strict(),
    sections: z
      .object({
        lanes: z.string(),
        research: z.string(),
        built: z.string(),
        data: z.string(),
        experience: z.string(),
        leadership: z.string(),
        writing: z.string(),
        contact: z.string(),
      })
      .strict(),
    actions: z
      .object({
        downloadCv: z.string(),
        email: z.string(),
        copyEmail: z.string(),
        copied: z.string(),
        readCaseStudy: z.string(),
        viewCode: z.string(),
        liveDemo: z.string(),
        readArticle: z.string(),
        backToWork: z.string(),
        skipIntro: z.string(),
      })
      .strict(),
    labels: z
      .object({
        teamProject: z.string(),
        illustration: z.string(),
        clock: z.string(),
        caveat: z.string(),
      })
      .strict(),
  })
  .strict();

/** A number always travels with its caveat — CLAUDE.md hard rule 2. */
const metric = z
  .object({
    value: z.string(),
    label: z.string(),
    caveat: z.string().optional(),
  })
  .strict();

export const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    group: z.enum(["research", "built", "data"]),
    lane: laneId,
    order: z.number().int().positive(),
    draft: z.boolean().default(false),
    year: z.string(),
    title: z.string(),
    context: z.string(),
    team: z.boolean(),
    teamSize: z.number().int().min(2).optional(),
    summary: z.string(),
    metrics: z.array(metric).optional(),
    tags: z.array(z.string()),
    image: asset.optional(),
    gallery: z.array(asset).optional(),
    links: z
      .object({
        caseStudy: caseStudyRoute.optional(),
        code: z.url().optional(),
        demo: z.url().optional(),
        report: z.url().optional(),
        article: z.url().optional(),
      })
      .strict(),
  })
  .strict()
  .refine((p) => p.teamSize === undefined || p.team, {
    message: "teamSize is set but team is false",
    path: ["team"],
  });

export const projectsSchema = z
  .object({ projects: z.array(projectSchema) })
  .strict();

export const experienceSchema = z
  .object({
    experience: z.array(
      z
        .object({
          id: z.string(),
          lane: laneId,
          period: z.string(),
          role: z.string(),
          org: z.string(),
          place: z.string(),
          bullets: z.array(z.string()).min(1),
          caseStudy: caseStudyRoute.optional(),
          ...draftable,
        })
        .strict(),
    ),
  })
  .strict();

export const leadershipSchema = z
  .object({
    intro: z.string(),
    roles: z.array(
      z
        .object({
          period: z.string(),
          role: z.string(),
          org: z.string(),
          detail: z.string(),
          ...draftable,
        })
        .strict(),
    ),
    speaking: z.array(z.string()),
    training: z.array(z.string()),
    gallery: z.array(galleryAsset),
  })
  .strict();

export const writingSchema = z
  .object({
    journalism: z
      .object({
        role: z.string(),
        org: z.string(),
        period: z.string(),
        summary: z.string(),
        archive: z.url(),
        selected: z.array(
          z
            .object({
              title: z.string(),
              url: z.url(),
              year: z.string(),
              ...draftable,
            })
            .strict(),
        ),
      })
      .strict(),
    technical: z
      .object({
        platform: z.string(),
        profile: z.url(),
        articles: z.array(
          z.object({ title: z.string(), url: z.url(), ...draftable }).strict(),
        ),
      })
      .strict(),
  })
  .strict();

/** Frontmatter of content/<locale>/case-studies/<slug>.md */
export const caseStudySchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string(),
    context: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    demo: z.url().optional(),
    code: z.url().optional(),
    report: z.url().optional(),
    ...draftable,
  })
  .strict();

export type Profile = z.infer<typeof profileSchema>;
export type Ui = z.infer<typeof uiSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectGroup = Project["group"];
export type LaneId = z.infer<typeof laneId>;
export type ExperienceItem = z.infer<typeof experienceSchema>["experience"][number];
export type Leadership = z.infer<typeof leadershipSchema>;
export type Writing = z.infer<typeof writingSchema>;
export type CaseStudyMeta = z.infer<typeof caseStudySchema>;
export type CaseStudy = CaseStudyMeta & { body: string };

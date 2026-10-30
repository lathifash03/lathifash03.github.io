import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudyBody } from "@/components/CaseStudyBody";
import { Container } from "@/components/ui/Section";
import { ProjectLinks } from "@/components/ui/ProjectLinks";
import { TagList } from "@/components/ui/Tag";
import {
  getCaseStudies,
  getCaseStudy,
  getProfile,
  getProjectForCaseStudy,
  getUi,
  reportMissingAssets,
} from "@/lib/content";

const locale = "en";

export function generateStaticParams() {
  return getCaseStudies(locale).map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(locale, slug);
  const profile = getProfile(locale);
  const project = getProjectForCaseStudy(locale, slug);
  const description = project?.summary ?? study.context;
  const path = `/projects/${slug}/`;

  return {
    title: `${study.title} — ${profile.name}`,
    description,
    alternates: { canonical: path },
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

export default async function CaseStudyPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(locale, slug);
  const profile = getProfile(locale);
  const ui = getUi(locale);
  const project = getProjectForCaseStudy(locale, slug);

  reportMissingAssets();

  // The case study's own frontmatter wins; anything else the project links to
  // (a repo, a report) still belongs at the foot of the page.
  const links = {
    demo: study.demo ?? project?.links.demo,
    code: study.code ?? project?.links.code,
    report: study.report ?? project?.links.report,
    article: project?.links.article,
  };
  const hasLinks = Object.values(links).some(Boolean);

  return (
    <>
      <header className="border-b border-line">
        <Container className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="text-[0.9375rem] text-ink">
            {profile.name}
          </Link>
          <Link
            href={project ? `/#${project.group}` : "/"}
            className="group inline-flex items-center gap-2 font-mono text-meta text-ink-2 transition-colors duration-200 hover:text-ink"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-[3px]"
            >
              ←
            </span>
            {ui.actions.backToWork}
          </Link>
        </Container>
      </header>

      <main>
        <article className="py-16 md:py-24">
          <Container>
            {/* One reading column, centred: a 68ch measure left against a
                1200px container leaves the page half empty (DESIGN.md §5). */}
            <div className="mx-auto max-w-[68ch]">
              <h1 className="max-w-[20ch] text-section text-ink">
                {study.title}
              </h1>

              <dl className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-meta text-ink-2">
                    {ui.labels.context}
                  </dt>
                  <dd className="mt-1 text-ink">{study.context}</dd>
                </div>
                <div>
                  <dt className="font-mono text-meta text-ink-2">
                    {ui.labels.role}
                  </dt>
                  <dd className="mt-1 text-ink">{study.role}</dd>
                </div>
              </dl>

              {project ? (
                <div className="mt-8">
                  <TagList tags={study.stack} lane={project.lane} />
                </div>
              ) : null}

              <div className="mt-16">
                <CaseStudyBody study={study} ui={ui} />
              </div>

              {hasLinks ? (
                <div className="mt-20 border-t border-line pt-8">
                  <ProjectLinks links={links} ui={ui} />
                </div>
              ) : null}
            </div>
          </Container>
        </article>
      </main>
    </>
  );
}

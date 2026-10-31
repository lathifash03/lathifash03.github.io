import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/pages/CaseStudyPage";
import { getCaseStudies } from "@/lib/content";
import { caseStudyMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getCaseStudies("en").map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return caseStudyMetadata("en", slug);
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CaseStudyPage locale="en" slug={slug} />;
}

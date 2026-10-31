import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/pages/CaseStudyPage";
import { getCaseStudies, prefixedLocales, toLocale } from "@/lib/content";
import { caseStudyMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ locale: string; slug: string }> };

/** See the sibling page: one route must exist even with nothing translated. */
export function generateStaticParams() {
  const params = prefixedLocales().flatMap((locale) =>
    getCaseStudies(locale).map((study) => ({ locale, slug: study.slug })),
  );
  return params.length ? params : [{ locale: "id", slug: "none" }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!prefixedLocales().some((item) => item === locale)) return {};
  return caseStudyMetadata(toLocale(locale), slug);
}

export default async function TranslatedCaseStudy({ params }: Params) {
  const { locale, slug } = await params;
  if (!prefixedLocales().some((item) => item === locale)) notFound();
  return <CaseStudyPage locale={toLocale(locale)} slug={slug} />;
}

import { Section } from "@/components/ui/Section";
import type { Ui, Writing as WritingContent } from "@/lib/content";

function ArticleLink({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={url}
      className="group grid gap-2 py-6 md:grid-cols-12 md:gap-8 border-t border-line"
    >
      <span className="text-ink md:col-span-10">{title}</span>
      <span
        aria-hidden="true"
        className="text-ink-2 transition-transform duration-200 group-hover:translate-x-[3px] md:col-span-2 md:text-right"
      >
        →
      </span>
    </a>
  );
}

export function Writing({
  content,
  ui,
}: {
  content: WritingContent;
  ui: Ui;
}) {
  const { journalism, technical } = content;

  return (
    <Section id="writing" index="06" title={ui.sections.writing}>
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div data-reveal className="lg:col-span-5">
          <p className="font-mono text-meta text-ink-2">{journalism.period}</p>
          <h3 className="mt-3 text-card text-ink">{journalism.role}</h3>
          <p className="mt-2 text-ink-2">{journalism.org}</p>
          <p className="mt-6 max-w-[60ch] text-ink">{journalism.summary}</p>
          <a
            href={journalism.archive}
            className="group mt-6 inline-flex items-center gap-1.5 text-ink underline decoration-line underline-offset-4 transition-colors duration-200 hover:decoration-ink"
          >
            {ui.actions.viewArchive}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-[3px]"
            >
              →
            </span>
          </a>

          {journalism.selected.length ? (
            <div className="mt-10">
              {journalism.selected.map((article) => (
                <ArticleLink
                  key={article.url}
                  title={article.title}
                  url={article.url}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div data-reveal className="lg:col-span-7">
          <p className="font-mono text-meta text-ink-2">
            {technical.platform}
          </p>
          <div className="mt-5">
            {technical.articles.map((article) => (
              <ArticleLink
                key={article.url}
                title={article.title}
                url={article.url}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

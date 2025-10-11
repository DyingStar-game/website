import type { News } from "@feat/news/news-manager";

export default function NewsList({ news }: { news: News[] }) {
  if (!news.length) {
    return <p className="text-brand-primary/70">Aucune news pour le moment.</p>;
  }
  return (
    <div className="space-y-8">
      {news.map((item) => (
        <article
          key={item.slug}
          className="border-brand-primary/25 bg-brand-charcoal/90 rounded-2xl border px-6 py-6 shadow-[0_0_40px_rgba(var(--brand-primary-rgb),0.1)] backdrop-blur"
        >
          <h3 className="text-brand-primary text-lg font-semibold tracking-[0.2em] uppercase">
            {item.attributes.title}
          </h3>
          <div
            className="text-brand-primary/85 [&_a]:text-brand-primary mt-4 space-y-4 leading-relaxed [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </article>
      ))}
    </div>
  );
}

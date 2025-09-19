import { NewsItem } from '@/lib/news';

export default function NewsList({ news }: { news: NewsItem[] }) {
  if (!news.length) {
    return <p className="text-brand-primary/70">Aucune news pour le moment.</p>;
  }
  return (
    <div className="space-y-8">
      {news.map((item) => (
        <article
          key={item.slug}
          className="rounded-2xl border border-brand-primary/25 bg-brand-charcoal/90 px-6 py-6 shadow-[0_0_40px_rgba(var(--brand-primary-rgb),0.1)] backdrop-blur"
        >
          <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-brand-primary">
            {item.title}
          </h3>
          <div
            className="mt-4 space-y-4 leading-relaxed text-brand-primary/85 [&_a]:text-brand-primary [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </article>
      ))}
    </div>
  );
}

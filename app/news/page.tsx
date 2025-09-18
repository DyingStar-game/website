import NewsList from '@/components/NewsList';
import { getAllNews } from '@/lib/news';

export default function NewsPage() {
  const news = getAllNews();
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Nouvelles</h1>
      <NewsList news={news} />
    </div>
  );
}

import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeaturedNews, { FeaturedNewsItem } from '@/components/FeaturedNews';
import ProjectDescription from '@/components/ProjectDescription';
import ImmersionShowcase from '@/components/ImmersionShowcase';
import Footer from '@/components/Footer';
import { getAllNews } from '@/lib/news';

const featuredNewsPresets = [
  {
    slug: '20250203-colonisation-des-premieres-planetes',
    fallbackTitle: 'Colonisation des premières planètes',
    fallbackMarkdown:
      "Les premières colonies dressent leurs dômes autonomes autour de la ceinture intérieure. L'organisation des routes et des stations d'énergie ouvre la voie à une expansion durable.",
    image: '/news-colonisation.svg',
    badge: 'Nouveau',
  },
  {
    slug: '20250202-archives-vivantes-du-dyingstar',
    fallbackTitle: 'Archives vivantes du DyingStar',
    fallbackMarkdown:
      "Les journaux de bord sont désormais reliés par un réseau quantique. Les équipages peuvent revivre les événements en réalité mixte pour préparer les missions à venir.",
    image: '/news-archives.svg',
    badge: 'Archive',
  },
  {
    slug: '20250201-observatoire-des-fragments',
    fallbackTitle: 'Observatoire des fragments stellaires',
    fallbackMarkdown:
      "Les chercheurs cartographient les fragments stellaires et anticipent les tempêtes magnétiques pour sécuriser les routes d'approvisionnement.",
    image: '/news-observatoire.svg',
    badge: 'Observatoire',
  },
  {
    slug: '20250130-architectes-des-cites-modulaires',
    fallbackTitle: 'Architectes des cités modulaires',
    fallbackMarkdown:
      "Les plans modulaires des futurs hubs communautaires sont publiés. Les avant-postes suspendus peuvent être assemblés et adaptés par chaque faction.",
    image: '/news-architectes.svg',
    badge: 'Construction',
  },
  {
    slug: '20250128-expedition-des-dunes-solaires',
    fallbackTitle: 'Expédition dans les dunes solaires',
    fallbackMarkdown:
      "L'escouade des éclaireurs cartographie les vallées de sable luminescent pour installer les premières balises d'approche. Les drones rapportent des panoramas inédits sur les tempêtes magnétisées.",
    image: '/news-expedition.svg',
    badge: 'Exploration',
  },
] as const;

export default function HomePage() {
  const news = getAllNews();

  const latestNews = news[0];
  const presetMatch = latestNews
    ? featuredNewsPresets.find((preset) => preset.slug === latestNews.slug) ?? featuredNewsPresets[0]
    : featuredNewsPresets[0];

  const featuredNews: FeaturedNewsItem[] = [
    {
      title: latestNews?.title ?? presetMatch.fallbackTitle,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Praesent nec lorem at dui volutpat dapibus, sed pharetra libero.',
      image: presetMatch.image,
      badge: presetMatch.badge,
    },
  ];

  return (
    <main className="min-h-screen text-amber-50">
      <Navigation />
      <Hero />
      <FeaturedNews items={featuredNews} />
      <ProjectDescription />
      <ImmersionShowcase />
      <Footer />
    </main>
  );
}

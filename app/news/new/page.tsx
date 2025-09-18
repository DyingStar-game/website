import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import NewsEditor from '@/components/NewsEditor';

export default async function NewNewsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user?.isAdmin || session.user?.isLeader)) {
    return <p className="p-4">Accès refusé</p>;
  }
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Nouvelle annonce</h1>
      <NewsEditor />
    </div>
  );
}
